<script lang="ts">
    import { browser } from '$app/environment';
    import { onDestroy, onMount } from 'svelte';

    interface Props {
        content: string;
    }

    let { content }: Props = $props();

    const SPEED_OPTIONS = [0.85, 1, 1.25, 1.5, 1.75, 2] as const;
    const BASE_WORDS_PER_MINUTE = 155;

    let supported = $state(true);
    let isPlaying = $state(false);
    let isPaused = $state(false);
    let progress = $state(0);
    let rate = $state<number>(1);
    let statusText = $state('Ready');
    let selectedVoice = $state<SpeechSynthesisVoice | null>(null);

    let fullText = '';
    let currentUtterance: SpeechSynthesisUtterance | null = null;
    let rafId: number | null = null;
    let playbackToken = 0;

    let segmentStartPercent = 0;
    let segmentElapsedMs = 0;
    let segmentDurationMs = 1;
    let segmentStartTs = 0;

    let isSeeking = false;
    let wasPlayingBeforeSeek = false;
    let wasPausedBeforeSeek = false;
    let pauseOnStartAfterSeek = false;

    const speedLabel = $derived(`${rate % 1 === 0 ? rate.toFixed(0) : rate.toFixed(2).replace(/0$/, '')}x`);

    const remainingLabel = $derived.by(() => {
        if (progress >= 100) {
            return '0:00';
        }

        const remainingPercent = Math.max(0, 100 - progress) / 100;
        const remainingMs = Math.max(0, segmentDurationMs * remainingPercent);
        const totalSeconds = Math.ceil(remainingMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    });

    function normalizeText(source: string): string {
        return source
            .replace(/\s+/g, ' ')
            .replace(/\s+([.,!?;:])/g, '$1')
            .trim();
    }

    function getArticleText(): string {
        const articleElement = document.querySelector('.article-content');
        const source = articleElement?.textContent || content;
        return normalizeText(source);
    }

    function countWords(text: string): number {
        return text.split(/\s+/).filter(Boolean).length;
    }

    function estimateDurationMs(text: string, speechRate: number): number {
        const words = Math.max(1, countWords(text));
        const wordsPerSecond = (BASE_WORDS_PER_MINUTE * speechRate) / 60;
        return (words / wordsPerSecond) * 1000;
    }

    function chooseVoice(): SpeechSynthesisVoice | null {
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) {
            return null;
        }

        const preferredKeywords = ['natural', 'neural', 'google', 'samantha', 'aria', 'jenny'];
        const premiumVoice = voices.find((voice) => {
            const lang = voice.lang.toLowerCase();
            const name = voice.name.toLowerCase();
            return lang.startsWith('en') && preferredKeywords.some((keyword) => name.includes(keyword));
        });

        const englishVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));
        return premiumVoice || englishVoice || voices[0] || null;
    }

    function clearProgressLoop() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function updateProgressFromClock() {
        if (!isPlaying || isPaused) {
            return;
        }

        const elapsed = segmentElapsedMs + (performance.now() - segmentStartTs);
        const localProgress = Math.max(0, Math.min(1, elapsed / segmentDurationMs));
        progress = Math.min(100, segmentStartPercent + localProgress * (100 - segmentStartPercent));

        if (progress < 100) {
            rafId = requestAnimationFrame(updateProgressFromClock);
        }
    }

    function beginProgressLoop() {
        clearProgressLoop();
        segmentStartTs = performance.now();
        rafId = requestAnimationFrame(updateProgressFromClock);
    }

    function clampPercent(value: number): number {
        return Math.max(0, Math.min(99.5, value));
    }

    function cancelSpeech() {
        playbackToken += 1;
        clearProgressLoop();
        currentUtterance = null;

        if (browser && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    function startFromPercent(startPercent: number) {
        if (!('speechSynthesis' in window)) {
            supported = false;
            statusText = 'Not supported in this browser';
            return;
        }

        if (!fullText) {
            statusText = 'No readable content';
            return;
        }

        const clampedPercent = clampPercent(startPercent);
        const startIndex = Math.floor((clampedPercent / 100) * fullText.length);
        const playbackText = fullText.slice(startIndex).trim();

        if (!playbackText) {
            isPlaying = false;
            isPaused = false;
            progress = 100;
            statusText = 'Completed';
            return;
        }

        if (!selectedVoice) {
            selectedVoice = chooseVoice();
        }

        const token = ++playbackToken;
        const utterance = new SpeechSynthesisUtterance(playbackText);
        utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 1;

        segmentStartPercent = clampedPercent;
        segmentElapsedMs = 0;
        segmentDurationMs = estimateDurationMs(playbackText, rate);

        utterance.onstart = () => {
            if (token !== playbackToken) {
                return;
            }

            isPlaying = true;
            isPaused = false;
            statusText = 'Playing';
            beginProgressLoop();

            if (pauseOnStartAfterSeek) {
                pauseOnStartAfterSeek = false;
                pauseReading();
            }
        };

        utterance.onend = () => {
            if (token !== playbackToken) {
                return;
            }

            clearProgressLoop();
            isPlaying = false;
            isPaused = false;
            currentUtterance = null;
            progress = 100;
            statusText = 'Completed';
        };

        utterance.onerror = () => {
            if (token !== playbackToken) {
                return;
            }

            clearProgressLoop();
            isPlaying = false;
            isPaused = false;
            currentUtterance = null;
            statusText = 'Playback error';
        };

        cancelSpeech();
        playbackToken = token;
        currentUtterance = utterance;
        progress = clampedPercent;
        window.speechSynthesis.speak(utterance);
    }

    function pauseReading() {
        if (!('speechSynthesis' in window) || !isPlaying || isPaused) {
            return;
        }

        window.speechSynthesis.pause();
        segmentElapsedMs += performance.now() - segmentStartTs;
        clearProgressLoop();
        isPaused = true;
        statusText = 'Paused';
    }

    function resumeReading() {
        if (!('speechSynthesis' in window) || !isPlaying || !isPaused) {
            return;
        }

        window.speechSynthesis.resume();
        isPaused = false;
        statusText = 'Playing';
        beginProgressLoop();
    }

    function togglePlayPause() {
        if (!supported) {
            return;
        }

        if (isPlaying) {
            if (isPaused) {
                resumeReading();
            } else {
                pauseReading();
            }
            return;
        }

        const startPoint = progress >= 99.5 ? 0 : progress;
        startFromPercent(startPoint);
    }

    function cycleSpeed() {
        const currentIndex = SPEED_OPTIONS.indexOf(rate as (typeof SPEED_OPTIONS)[number]);
        const nextIndex = currentIndex === -1 || currentIndex === SPEED_OPTIONS.length - 1 ? 0 : currentIndex + 1;
        rate = SPEED_OPTIONS[nextIndex];

        if (isPlaying || isPaused) {
            const resumeAt = progress;
            startFromPercent(resumeAt);
            return;
        }

        statusText = `Speed ${speedLabel}`;
    }

    function getPercentFromClientX(eventX: number, track: HTMLElement): number {
        const rect = track.getBoundingClientRect();
        if (!rect.width) {
            return progress;
        }

        return clampPercent(((eventX - rect.left) / rect.width) * 100);
    }

    function seekFromPercent(nextPercent: number) {
        progress = clampPercent(nextPercent);

        if (wasPlayingBeforeSeek || wasPausedBeforeSeek) {
            pauseOnStartAfterSeek = wasPausedBeforeSeek;
            startFromPercent(progress);
        } else {
            statusText = 'Ready';
        }

        wasPlayingBeforeSeek = false;
        wasPausedBeforeSeek = false;
    }

    function handleSeekPointerDown(event: PointerEvent) {
        if (!supported) {
            return;
        }

        const track = event.currentTarget;
        if (!(track instanceof HTMLElement)) {
            return;
        }

        event.preventDefault();
        track.setPointerCapture(event.pointerId);

        isSeeking = true;
        wasPlayingBeforeSeek = isPlaying;
        wasPausedBeforeSeek = isPaused;

        if (isPlaying || isPaused) {
            cancelSpeech();
            isPlaying = false;
            isPaused = false;
        }

        progress = getPercentFromClientX(event.clientX, track);
    }

    function handleSeekPointerMove(event: PointerEvent) {
        if (!isSeeking) {
            return;
        }

        const track = event.currentTarget;
        if (!(track instanceof HTMLElement)) {
            return;
        }

        progress = getPercentFromClientX(event.clientX, track);
    }

    function handleSeekPointerUp(event: PointerEvent) {
        if (!isSeeking) {
            return;
        }

        const track = event.currentTarget;
        if (!(track instanceof HTMLElement)) {
            return;
        }

        if (track.hasPointerCapture(event.pointerId)) {
            track.releasePointerCapture(event.pointerId);
        }

        isSeeking = false;
        seekFromPercent(progress);
    }

    function handleSeekKeydown(event: KeyboardEvent) {
        const step = event.shiftKey ? 10 : 5;
        let nextPercent: number | null = null;

        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            nextPercent = progress + step;
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            nextPercent = progress - step;
        } else if (event.key === 'Home') {
            nextPercent = 0;
        } else if (event.key === 'End') {
            nextPercent = 99.5;
        }

        if (nextPercent === null) {
            return;
        }

        event.preventDefault();
        wasPlayingBeforeSeek = isPlaying;
        wasPausedBeforeSeek = isPaused;

        if (isPlaying || isPaused) {
            cancelSpeech();
            isPlaying = false;
            isPaused = false;
        }

        seekFromPercent(nextPercent);
    }

    onMount(() => {
        supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
        fullText = getArticleText();

        if (!supported) {
            statusText = 'Not supported in this browser';
            return;
        }

        selectedVoice = chooseVoice();
        const refreshVoices = () => {
            selectedVoice = selectedVoice || chooseVoice();
        };

        window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', refreshVoices);
        };
    });

    onDestroy(() => {
        cancelSpeech();
    });
</script>

<section class="voice-player" aria-label="Article audio preview">
    <button
        type="button"
        class="play-btn"
        onclick={togglePlayPause}
        aria-label={isPlaying && !isPaused ? 'Pause reading' : 'Play reading'}
        title={isPlaying && !isPaused ? 'Pause' : 'Play'}
        disabled={!supported}
    >
        {#if isPlaying && !isPaused}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="7" y="5" width="3.5" height="14" rx="1"></rect>
                <rect x="13.5" y="5" width="3.5" height="14" rx="1"></rect>
            </svg>
        {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l10-6.5z"></path>
            </svg>
        {/if}
    </button>

    <div class="progress-panel">
        <span class="sr-only" role="status" aria-live="polite">{statusText}</span>
        <span class="sr-only">{Math.round(progress)}% complete, {remainingLabel} remaining</span>
        <div
            class="progress-track"
            role="slider"
            tabindex="0"
            aria-label="Seek audio"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(progress)}
            onpointerdown={handleSeekPointerDown}
            onpointermove={handleSeekPointerMove}
            onpointerup={handleSeekPointerUp}
            onpointercancel={handleSeekPointerUp}
            onkeydown={handleSeekKeydown}
        >
            <div class="progress-fill" style={`width: ${progress}%;`}></div>
        </div>
    </div>

    <button
        type="button"
        class="speed-btn"
        onclick={cycleSpeed}
        aria-label="Change playback speed"
        title="Playback speed"
        disabled={!supported}
    >
        {speedLabel}
    </button>
</section>

<style>
    .voice-player {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 12px;
        margin-top: 0;
        padding: 10px;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        background-color: color-mix(in srgb, var(--color-bg) 82%, var(--color-bg-secondary));
        touch-action: manipulation;
    }

    .play-btn,
    .speed-btn {
        height: 42px;
        min-width: 42px;
        padding: 0 14px;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        background: color-mix(in srgb, var(--color-bg) 74%, var(--color-bg-secondary));
        color: var(--color-fg);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        line-height: 1;
        letter-spacing: 0.02em;
        cursor: pointer;
        transition:
            background-color 160ms ease,
            border-color 160ms ease,
            color 180ms ease,
            opacity 160ms ease;
    }

    .play-btn {
        width: 42px;
        padding: 0;
    }

    .speed-btn {
        min-width: 60px;
    }

    .play-btn:hover,
    .speed-btn:hover {
        background: color-mix(in srgb, var(--color-bg-secondary) 84%, var(--color-bg));
        border-color: color-mix(in srgb, var(--color-border) 65%, var(--color-fg) 35%);
    }

    .play-btn:active,
    .speed-btn:active {
        background: color-mix(in srgb, var(--color-bg-secondary) 90%, var(--color-bg));
        border-color: color-mix(in srgb, var(--color-border) 60%, var(--color-fg) 40%);
    }

    .play-btn:focus-visible,
    .speed-btn:focus-visible {
        outline: 2px solid var(--color-link);
        outline-offset: 2px;
    }

    .play-btn:disabled,
    .speed-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .progress-panel {
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .progress-track {
        position: relative;
        height: 6px;
        width: 100%;
        border-radius: 999px;
        overflow: hidden;
        background: color-mix(in srgb, var(--color-border) 70%, var(--color-bg));
        cursor: pointer;
        outline: none;
    }

    .progress-track:focus-visible {
        outline: 2px solid var(--color-link);
        outline-offset: 2px;
    }

    .progress-fill {
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--color-fg-secondary) 90%, var(--color-fg) 10%),
            color-mix(in srgb, var(--color-fg) 88%, black 12%)
        );
        transition: width 36ms linear;
        will-change: width;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    @media (max-width: 700px) {
        .voice-player {
            gap: 10px;
            padding: 8px;
        }

        .speed-btn {
            min-width: 56px;
            padding: 0 12px;
        }
    }
</style>

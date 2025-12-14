<script lang="ts">
    interface Props {
        content: string;
    }

    let { content }: Props = $props();

    let isPlaying = $state(false);
    let progress = $state(0);
    let statusText = $state('');
    let utterance: SpeechSynthesisUtterance | null = null;
    let progressInterval: number | null = null;
    let estimatedDuration = 0;
    let startTime = 0;

    function getArticleText(): string {
        const articleElement = document.querySelector('.article-content');
        if (!articleElement) return content;
        return articleElement.textContent || content;
    }

    function startReading() {
        if (!('speechSynthesis' in window)) {
            statusText = 'Text-to-speech not supported';
            return;
        }

        const text = getArticleText();
        const wordCount = text.split(/\s+/).length;
        const wordsPerMinute = 150 * 0.9;
        estimatedDuration = (wordCount / wordsPerMinute) * 60 * 1000;

        utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            isPlaying = true;
            statusText = 'Reading...';
            startTime = Date.now();
            progressInterval = window.setInterval(updateProgress, 100);
        };

        utterance.onend = () => {
            isPlaying = false;
            progress = 100;
            statusText = 'Completed';
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
            setTimeout(() => {
                progress = 0;
                statusText = '';
            }, 3000);
        };

        utterance.onerror = () => {
            isPlaying = false;
            statusText = 'Error occurred';
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    function stopReading() {
        window.speechSynthesis.cancel();
        isPlaying = false;
        statusText = 'Stopped';
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
        setTimeout(() => {
            progress = 0;
            statusText = '';
        }, 2000);
    }

    function updateProgress() {
        if (!isPlaying || estimatedDuration === 0) return;
        const elapsed = Date.now() - startTime;
        progress = Math.min(99, (elapsed / estimatedDuration) * 100);
    }

    function toggleReading() {
        if (isPlaying) {
            stopReading();
        } else {
            startReading();
        }
    }
</script>

<div class="listen-section">
    <button class="listen-btn" onclick={toggleReading}>
        {#if isPlaying}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
            Stop Reading
        {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
            Listen to Article
        {/if}
    </button>
    {#if isPlaying || statusText}
        <div class="progress-container">
            <div class="progress-labels">
                <span>{statusText}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: {progress}%"></div>
            </div>
        </div>
    {/if}
</div>

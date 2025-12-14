---
title: On Building Software That Lasts
description: Thoughts on creating software with longevity in mind, focusing on simplicity and maintainability.
date: 2025-12-12
category: Development
tags:
  - software
  - architecture
  - design
draft: false
---

Software has a tendency to rot. Not in the physical sense, but in the way that code becomes harder to understand, modify, and maintain over time. I've been thinking about what makes some software last while others crumble.

## The Complexity Trap

We often reach for complexity when simplicity would suffice. A new framework here, an abstraction layer there. Each decision makes sense in isolation, but together they create a tangled mess that nobody wants to touch.

The best code I've worked with shares a common trait: it's boring. Not boring in a bad way, but boring in the sense that it does exactly what you expect, nothing more.

## Principles for Longevity

After years of building and maintaining software, a few principles have emerged:

1. **Prefer explicit over implicit.** Magic is fun until you need to debug it at 3 AM.

2. **Choose dependencies carefully.** Every library you add is a liability. The JavaScript ecosystem is particularly notorious for this.

3. **Write for the reader.** Code is read far more often than it's written. Optimize for understanding.

Here's an example of what I mean:

```typescript
// This is clear and obvious
function calculateTotal(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}

// This is clever but harder to understand
const calculateTotal = (items: Item[]): number =>
  items.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
```

Both work. The first is easier to debug, extend, and explain to someone new to the codebase.

## The Human Element

Software doesn't exist in a vacuum. It's built by humans, for humans. The best architectures account for this reality. They recognize that the people maintaining the code will change, that requirements will shift, that understanding will fade over time.

Build software as if you'll have to explain it to someone who's never seen it before. Because eventually, you will.

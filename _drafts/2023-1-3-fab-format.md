---
title: "Shrink-to-fit and Balanced Text on HTML Canvas"
subtitle: "A fast text-formatting algorithm"
layout: default
active_tab: blog
tags: ["js", "html", "canvas", "meme"]
categories: ["engineering"]
---

Welcome to my first blog post! In this post, I will share with you an algorithm for rendering automatically-sized and balanced text onto a HTMLCanvasElement, that I call <dfn>Fit And Balance Format</dfn> (FAB Format).

This following content assumes basic familiarity with JavaScript and the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

Let's first understand the problem: often when working with Canvas API, it's a common operation to render text onto a canvas. To do so, the Canvas API conveniently provides 2 functions on the `CanvasRenderingContext2D` interface: `fillText(text, x, y [, maxWidth])` and `strokeText(text, x, y [, maxWidth])`. However, the conveniences end there because unlike in HTML, these functions don't automatically wrap or resize text to fit nicely, even if `maxWidth` is specified. Text-wrapping and sizing must be done manually.

Moreover, when text wraps, it's often appealing to make the text <dfn>balanced</dfn>, which means lines of text are <q>rendered so that the amount of text on each line is about the same</q> (Adobe).


...
Let us revisit the Adobe definition of <dfn>balanced</dfn> text: lines of text that are rendered so that the amount of text on each line is about the same.

Unfortunately, while most people might have an intuitive idea of what this would look like, the definition doesn't reveal much as to how to approach an implementation. The issue is that this definition isn't rigorous; what does "about the same" really mean? Do get a better and more rigorous understanding, it helps to investigate some examples.

...
Rigorously, lines of text are considered <dfn>balanced</dfn> if and only if the bounding box of the text has the minimum width such that no additional lines are created.
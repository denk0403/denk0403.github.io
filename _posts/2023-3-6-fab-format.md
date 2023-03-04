---
title: "A FABulous Text-Formatting Algorithm for the HTML Canvas (WIP)"
description: "Implementing automatic sizing and balancing of text on a `<canvas>`."
tags: ["js", "html", "canvas", "meme"]
permalink: "/blog/fab_format"
# categories: ["engineering", "blog"]

---

The JavaScript [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) comes "batteries not included". As a low-level API, it often requires third-party libraries to work with even simple graphics. However, one of the greatest pain points of the API is it's rudimentary text-formatting capabilities.

<warning markdown="span">
<i class="fa-solid fa-exclamation" style="float: left; font-size: 1lh; color: orangered; margin-right: 10px;"></i>
Warning: The following content assumes basic familiarity with JavaScript and the Canvas API.
</warning>

# WIP

Let's first understand the problem: often when working with Canvas API, it's a common operation to render text onto a canvas. To do so, the Canvas API conveniently provides 2 functions on the `CanvasRenderingContext2D` interface: `fillText(text, x, y [, maxWidth])` and `strokeText(text, x, y [, maxWidth])`. However, the conveniences end there because unlike in HTML, these functions don't automatically wrap or resize text to fit nicely, even if `maxWidth` is specified. Text-wrapping and sizing must be done manually.

Moreover, when text wraps, it's often appealing to make the text <dfn>balanced</dfn>, which means lines of text are <q>rendered so that the amount of text on each line is about the same</q> (Adobe).

...
Let us revisit the Adobe definition of <dfn>balanced</dfn> text: lines of text that are rendered so that the amount of text on each line is about the same.

Unfortunately, while most people might have an intuitive idea of what this would look like, the definition doesn't reveal much as to how to approach an implementation. The issue is that this definition isn't rigorous; what does "about the same" really mean? Do get a better and more rigorous understanding, it helps to investigate some examples.

...
Rigorously, lines of text are considered <dfn>balanced</dfn> if and only if the bounding box of the text has the minimum width such that no additional lines are created.

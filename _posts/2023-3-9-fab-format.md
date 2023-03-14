---
title: "(WIP) A FABulous Text-Formatting Algorithm for the HTML Canvas"
description: "Implement automatic sizing and balancing of text on an HTML canvas."
tags: ["js", "html", "canvas", "meme"]
permalink: "/blog/fab_format"
add_head:
  - <script src="/components/GeneratorPlayer.js"></script>
# categories: ["engineering", "blog"]
---

{: style="text-align: center"}

## 🚧 WIP - Come back soon! 🚜

<div markdown="0">
{% include html/1-fab_format/demo1.html %}
</div>

{% include html/toc.html %}

<!-- excerpt-start -->

The JavaScript [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) comes "batteries not included". As a relatively low-level API, it often requires third-party libraries to work with even simple graphics. However, one of the greatest pain points of the API is it's rudimentary text-formatting capabilities.

<!-- excerpt-end -->

<div>
If you have ever tried rendering "Hello World" onto an HTML canvas, on your first attempt, you probably drew something like this:
<canvas height="33" style="background: white; height: 33px" title="Demo 1: Text is off-screen."></canvas>
(The text is off-screen.)

But after messing around with the CanvasRenderingContext2D `font` and `textBaseline` properties and text placement, you likely arrived at something like this:

<div markdown="0">
  {% include html/1-fab_format/demo2.html %}
</div>
</div>

<div>
And you probably thought <q>That looks great, I'm getting the hang of this!</q>, but then you tried to render arbitrary text:

<div markdown="0">
{% include html/1-fab_format/demo3.html %}
</div>

{% assign longText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sagittis turpis et elit convallis, non varius sem bibendum. Cras faucibus est in dui rhoncus varius. Donec sed tellus fermentum, hendrerit dolor ut, fringilla elit. Vestibulum eros purus, vehicula in mauris gravida, consequat sagittis felis. Aliquam vel dui at magna commodo posuere malesuada quis dui. Ut ultrices accumsan felis sed suscipit. Fusce dictum, diam nec varius sodales, turpis lacus vestibulum mauris, eu vestibulum risus ante dictum dolor. Morbi nisi dolor, varius non egestas vitae, finibus et nulla." %}

On a wide enough screen, this might look fine and you'd perhaps never notice an issue.
But for those on smaller devices or who try a <a href="javascript:demo3_input.value = '{{ longText }}'; demo3_input.dispatchEvent(new Event('input'))">longer input text</a>, they see the text clipped.

</div>

<div>
Unfortunately, if you want to format text into some fixed region of the canvas, the Canvas API is limited in its capabilities. Even if you're clever and have already figured out text wrapping, you can still run out of vertical space or even have single words that are too long.

<div markdown="0">
{% include html/1-fab_format/demo4.html %}
</div>

You're probably thinking, <q>Well that's kind of frustrating. It should be easier,</q>, and you're right. However, the manual solution actually lends a rather elegant algorithm.

</div>

# Motivation

<div>
I personally had a use case for the algorithm when I was developing <a href="/Mocking-Spongebob/">Mocking SpongeBob Meme Generator</a>. The goal for that project was to be able to generate and send memes as quickly as possible, and doing so required automatically formatting the caption for the user into a fixed region of the image.

<img src="/resources/imgs/spongebob_fab_format_demo.gif" loading="lazy" height="250" alt="A GIF demoing the formatting algorithm in Mocking SpongeBob Meme Generator.">

While this was one of my more silly projects, it came with a lot of interesting UI/UX challenges that probably deserve a blog post of their own. However, the most difficult challenge to solve by far was the automatic layout algorithm.

</div>

## To be Continued

<!-- https://drafts.csswg.org/css-text-4/#propdef-text-wrap
"Line boxes are balanced when the standard deviation from the average inline-size of the remaining space in each line box is reduced over the block (including lines that end in a forced break)."

Let's first understand the problem: often when working with Canvas API, it's a common operation to render text onto a canvas. To do so, the Canvas API conveniently provides 2 functions on the `CanvasRenderingContext2D` interface: `fillText(text, x, y [, maxWidth])` and `strokeText(text, x, y [, maxWidth])`. However, the conveniences end there because unlike in HTML, these functions don't automatically wrap or resize text to fit nicely, even if `maxWidth` is specified. Text-wrapping and sizing must be done manually.

Moreover, when text wraps, it's often appealing to make the text <dfn>balanced</dfn>, which means lines of text are <q>rendered so that the amount of text on each line is about the same</q> (Adobe).

...
Let us revisit the Adobe definition of <dfn>balanced</dfn> text: lines of text that are rendered so that the amount of text on each line is about the same.

Unfortunately, while most people might have an intuitive idea of what this would look like, the definition doesn't reveal much as to how to approach an implementation. The issue is that this definition isn't rigorous; what does "about the same" really mean? Do get a better and more rigorous understanding, it helps to investigate some examples.

...
Rigorously, lines of text are considered <dfn>balanced</dfn> if and only if the bounding box of the text has the minimum width such that no additional lines are created. -->

---
title: "Animating along an SVG Path with CSS Scroll-driven Animations"
description: "Implement an animation along an SVG path using only CSS and Scroll-driven Animations."
tags: ["css", "html", "animation", "scroll", "svg"]
permalink: "/blog/path_scroll_animation"
add_head:
  - <script type="module" src="/components/StackOverflowWidget.js"></script>
  - <link rel='stylesheet' href='/highlight.css' />
# categories: ["engineering", "blog"]
---

<style>
    stack-overflow-widget {
        display: block;
        min-height: 95px;
        box-sizing: content-box;
    }
</style>

<p class="warning" id="compat-warning">The content in this blog post discusses an <a href="https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Experimental_deprecated_obsolete#experimental">experimental browser technology</a>. At the time of publication, Scroll-driven Animations are only supported in Chrome 115+ with “Experimental Web Platform Features” enabled, and CSS motion paths have limited support.</p>

<script>
    const scrollFunctionSupported = CSS.supports("animation-timeline", "scroll()");
    const urlPathSupported = CSS.supports("offset-path", "url(#path)");
    window["compat-warning"].innerHTML += scrollFunctionSupported && urlPathSupported
        ? " Your current browser <b>supports</b> Scroll-driven Animations and CSS motion paths."
        : " Your current browser <b>does not</b> fully support either Scroll-driven Animations or CSS motion paths. The demos below will not work."
</script>

{% include html/toc.html %}

<!-- excerpt-start -->

Animations can be a tricky part of a web application to get right, especially if you are handwriting them. However, they can undoubtedly bring quality of life and UX improvements, as well as marketing advantages when applied tastefully.

<!-- excerpt-end -->

<div>
<details markdown="0" style="margin-bottom: 10px;">
    <summary>Apple.com Scroll Animation Example</summary>
    <figure>
        <picture>
            <source srcset="/resources/blog/2-path_scroll_animation/apple_scroll_animation.avif" type="image/avif" width="100%">
            <source srcset="/resources/blog/2-path_scroll_animation/apple_scroll_animation.webp" type="image/webp" width="100%">
            <img src="/resources/blog/2-path_scroll_animation/apple_scroll_animation.gif" width="600" height="323" loading="lazy">
        </picture>
        <figcaption>The 2022 MacBook Pro product page showing a scroll-driven animation.</figcaption>
    </figure>
</details>

Popularized by sites like <a href="https://www.apple.com/">apple.com</a>, one common type of animation is scroll-driven animations. These types of animations are great for when you want to keep a users attention on something as they browse the page. Unfortunately, scroll-driven animations have traditionally been impossible to implement with pure CSS, and require at least a few lines of JavaScript to setup a scroll event listener and perform calculations.

</div>

However, I recently came across the following Stack Overflow question in which a user wanted to implement an animation that followed an SVG path as the user scrolls.

<stack-overflow-widget data-href="https://api.stackexchange.com/2.3/questions/76293013?&site=stackoverflow"></stack-overflow-widget>

Historically, achieving such an effect not only demands JavaScript for the event listener and calculations, but also for getting points on the path via [`getPointAtLength()`](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement/getPointAtLength). All in all, the best current solution to produce such such a simply describable effect is fairly complex. But not for much longer.

# Scroll-driven Animations

There is a new [CSS Specification](https://www.w3.org/TR/scroll-animations-1/) which aims to solve the dependency on JavaScript for scroll-driven animations, by expanding the capabilities of CSS animations. The spec has a lot of technical language, but let's see it in action by recreating the problem from the Stack Overflow post.

Say I have the following code which defines an SVG path and an image element. I would like to animate the image as I scroll, along the SVG path. How do I achieve this using only CSS scroll-driven animations?

{% include html/2-path_scroll_animation/demo1.html %}

In general, the modern strategy is to use [CSS motion paths](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_motion_path). Specifically, we can use the [`offset-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path) style property with the [`url()`](https://developer.mozilla.org/en-US/docs/Web/CSS/url) CSS function to reference the SVG path for the image to follow. For example, in the code above, you would set `offset-path: url(#my_path)`. And then in your `@keyframes` (which I called `offsetDistance`), simply transition from [`offset-distance: 0%;`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-distance) to `offset-distance: 100%;`.

To drive the animation, rather than designating a duration, we must specify the [`animation-timeline`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline).
However, the method of attaching a scroll-driven timeline to your animation depends largely on the structure of your page and precisely where the path is located on the page. Namely, there are two cases.

## Case 1: The path spans the entire scroll container

This is the simple case. We associate a scroll timeline with the animation using the [`scroll()`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/scroll) CSS function, which references the block axis of the nearest ancestor scroll container. And then we set the animation on the image element using `animation: offsetDistance linear;`.

Make sure to also set the initial position of the image to `(0,0)` of the [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent) via `position: absolute` and `inset: 0`. All together, the code should look something like this:

{% include html/2-path_scroll_animation/demo2.html %}

<small>Note: In the event that you don't want the image to rotate in the direction of the path, set [`offset-rotate`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-rotate) to `0rad` in the CSS.</small>

## Case 2: The path spans a portion of the scroll container

In this case, we must use a [View Progress Timeline](https://www.w3.org/TR/scroll-animations-1/#view-timelines) which requires a little more effort to setup correctly, and so it's easier to explain step-by-step.

1.  First, define a [`timeline-scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/timeline-scope) on the nearest common ancestor of the image and SVG path. This property can be any dashed identifier such as `--container`, and its function is to scope the specified timeline name to the selected element’s subtree.

    In other words, `timeline-scope` doesn't actually define a view timeline on the selected element. Instead, it defers the attachment of a view timeline to a descendent, and enables any other descendent in the selected element's subtree to reference the timeline as well. This is ultimately what will allow the path element's visibility to control the animation timeline for the sibling image element.

    ```css
    #container {
    	timeline-scope: --container;
    }
    ```

2.  Now, define a view timeline on the path element using [`view-timeline-name`](https://developer.mozilla.org/en-US/docs/Web/CSS/view-timeline-name), and attach it to the declared scope with the same name, like so:

    ```css
    #my_path {
    	view-timeline-name: --container;
    	/* or using the shorthand */
    	view-timeline: --container;
    }
    ```

3.  Next, bind the timeline's progress to the image's animation progress by using the `animation-timeline` property and referencing the timeline by name again.

    ```css
    #car {
    	animation-timeline: --container;
    }
    ```

4.  Afterward, determine your animation timeline's range with [`animation-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range). This property allows you to crop or expand the timeline interval for which the animation is active using offsets of predefined segments. Unfortunately, the value also depends greatly on your page's structure and likely requires some manual testing. However, [this tool](https://scroll-driven-animations.style/tools/view-timeline/ranges/) created by [Bramus](https://twitter.com/bramus) is extremely helpful in understanding the behavior of various ranges and choosing the one that works for you. In this example, I chose the following:

    ```css
    #car {
    	animation-timeline: --container;
    	animation-range:
                exit-crossing -5% /* start animation just before beginning to exit */
                entry-crossing 105%; /* end animation just after fully entering */
    }
    ```

5.  Lastly, to prevent the visual glitches at the end of the animation caused by resetting styles, change the [`animation-fill-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode) to `forwards`. The [`animation-timing-function`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function) can be anything that looks best to you, but for uniformity across displays, I chose `linear`.

    ```css
    #car {
    	animation: offsetDistance linear forwards;
    	animation-timeline: --container;
    	animation-range:
                exit-crossing -5% /* start animation just before beginning to exit */
                entry-crossing 105%; /* end animation just after fully entering */
    }
    ```

Finally, putting everything together, we get the following animation:

{% include html/2-path_scroll_animation/demo3.html %}

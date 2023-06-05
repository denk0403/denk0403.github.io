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

In general, the strategy is to use the [`offset-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path) style property with the [`url()`](https://developer.mozilla.org/en-US/docs/Web/CSS/url) CSS function to reference the SVG path to follow. In this case specifically, you would set it to `url(#my_path)`. And then in your `@keyframes` (I called it `offsetDistance`), simply transition from [`offset-distance: 0%;`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-distance) to `offset-distance: 100%;`.

However, the method of attaching a scroll-driven timeline to your animation depends largely on the structure of your page and precisely where the path is located on the page. Namely, there are two cases.

## Case 1: The path spans the entire scroll container

This is the simple case. We can associate a scroll timeline with the animation using [`animation-timeline: scroll();`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/scroll), which references the block axis of the nearest ancestor scroll container. And then we set the animation on the image element using `animation: offsetDistance linear;`.

Make sure to also set the initial position of the image to `(0,0)` of the [offset parent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent) via `position: absolute` and `inset: 0`. All together, the code should look something like this:

{% include html/2-path_scroll_animation/demo2.html %}

<small>Note: In the event that you don't want the image to rotate in the direction of the path, set [`offset-rotate`](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-rotate) to `0rad` in the CSS.</small>

## Case 2: The path spans a portion of the scroll container

In this case, we must use a [View Progress Timeline](https://www.w3.org/TR/scroll-animations-1/#view-timelines) which requires a little more effort to setup correctly, and so it's easier to explain step-by-step.

1.  Define a named view timeline and deferred scope on the nearest common ancestor of the image and SVG path. This defers the attachment of a view timeline to a descendent, which will ultimately enable the path element's visibility to control the animation timeline for the image.

    ```css
    #container {
        view-timeline-name: --container;
        view-timeline-attachment: defer;
    }
    ```

2.  Attach the path element to the same ancestral view timeline, like so:

    ```css
    #my_path {
        view-timeline-name: --container;
        view-timeline-attachment: ancestor;
    }
    ```

3.  Associate the named timeline with the element's animation.

    ```css
    #car {
        animation-timeline: --container;
        /* ... */
    }
    ```

4.  Determine your animation's timeline range. This also depends greatly on your page's structure and likely requires some manual testing. However, [this tool](https://scroll-driven-animations.style/tools/view-timeline/ranges/) created by [Bramus](https://twitter.com/bramus) is extremely helpful in understanding the behavior of various ranges. In this example, I choose the following:

    ```css
    #car {
        animation-timeline: --container;
        animation-range: exit-crossing -5% entry-crossing 105%;
        /* ... */
    }
    ```

5.  Lastly, to prevent the visual glitches at the end of the animation caused by styles resetting, change the [`animation-fill-mode`](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode) to `forwards`.

    ```css
    #car {
        animation: offsetDistance linear forwards;
        animation-timeline: --container;
        animation-range: exit-crossing -5% entry-crossing 105%;
        /* ... */
    }
    ```

Finally, putting everything together, we get the following animation:

{% include html/2-path_scroll_animation/demo3.html %}

---
title: "Blog"
layout: default
active_tab: blog
add_head:
  - <script src="/components/BalanceText.js"></script>
---

Welcome to my blog! Here you will find a series of posts I've written on topics ranging from code walks to my personal hot developer takes. Feel free to email me any comments or questions you may have about them.

<ul style="list-style: none; padding: 0;">
  {% for post in site.posts %}
    <li style="border-bottom: 2px solid #333">
      {% include html/blog_item.html
					title=post.title
					date=post.date
					url=post.url
					excerpt=post.excerpt  %}
    </li>
  {% endfor %}
</ul>

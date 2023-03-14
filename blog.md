---
title: "Blog"
layout: default
active_tab: blog
add_head:
  - <script src="/components/BalanceText.js"></script>
---

# Pinned<i class="fa-solid fa-thumbtack fa-2xs" style="rotate: 45deg; margin-left: 10px;"></i>

{% assign pinned = site.posts | find: "permalink","/blog/fab_format" %}

<div markdown="0">
    {% include html/blog_item.html
      title=pinned.title
      date=pinned.date
      url=pinned.url
      excerpt=pinned.excerpt  %}
</div>

<div style="display: flex; justify-content: space-between; align-items: center;">
# All Articles

<a class="v-align" href="/blog.rss">
  RSS<i class="fa-solid fa-square-rss fa-2x" style="color: #f69537; margin-left: 10px;"></i>
</a>

</div>

<ul style="list-style: none; padding: 0; margin: 0;">
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

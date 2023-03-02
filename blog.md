---
title: "DenniBlog"
layout: default
active_tab: blog
---

Welcome to my blog! Here you will find a series of posts I've written on topics ranging from code walks to my personal hot developer takes. Feel free to email me any comments or questions you may have about them.

{% if site.posts.size == 0 %}
{: style="text-align: center"}

## 🚧 First post coming soon! 🚜

<details class="resume">
  <summary>Sneak Peak!</summary>
  <img src="/resources/imgs/fab_format_demo.gif" loading="lazy" />
</details>

{% else %}

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}<br>{{ post.subtitle }}</a>
    </li>
  {% endfor %}
</ul>
{% endif %}

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

<ul style="list-style: none; padding: 0;">
  {% for post in site.posts %}
    <li>
      <a class="container-link" href="{{ post.url }}" style="border-bottom: 2px solid #333">
					<div class="title-date">
						<span class="title">{{ post.title }}</span>
						<span class="date">{{ post.date | date_to_string: "ordinal", "US" }}</span>
					</div>
					<div class="excerpt">{{ post.excerpt | strip_html | truncate:170 }}</div>
				</a>
    </li>
  {% endfor %}
</ul>
{% endif %}

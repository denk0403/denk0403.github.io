---
title: "Blog"
layout: default
active_tab: blog
---

# Posts

{% if site.posts.size == 0 %}
{: style="text-align: center"}

## 🚧 Coming soon! 🚜

{% else %}

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
{% endif %}
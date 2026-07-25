---
layout: mypost
title: About
lang: en
eyebrow: Research profile
subtitle: Researcher in operating systems and machine learning systems, focused on efficient inference, reliable GPU sharing, and collaborative edge–cloud computing.
page_class: page-about
description: Research profile, publications, projects, experience, and contact information for Zhenyuan Yang.
permalink: /pages/about.html
---

<p class="about-summary">I am a master’s student at the Institute of Software, Chinese Academy of Sciences (ISCAS), and a research intern at Huawei 2012 Laboratories. I use this site to document research ideas, implementation notes, and lessons learned from building systems.</p>

## Education

| Period | Institution | Program |
| --- | --- | --- |
| Sep 2025 – Present | Institute of Software, Chinese Academy of Sciences | M.S. in Computer Science and Technology |
| Sep 2021 – Jun 2025 | Nanjing University | B.Eng. in Computer Science and Technology |

## Experience

| Period | Organization | Role |
| --- | --- | --- |
| Jul 2026 – Present | Huawei 2012 Laboratories · Central Research Institute | Research Intern |

## Research Interests

- Efficient inference for resource-constrained edge devices
- Flexible, predictable, and reliable GPU spatial sharing
- Communication and scheduling in collaborative edge–cloud systems

## Selected Research

<ol class="about-publications">
{% for paper in site.data.publications %}
  <li>
    <p class="publication-title">
      {% if paper.url %}<a href="{{ paper.url }}" target="_blank" rel="noopener noreferrer">{{ paper.title }}</a>{% else %}{{ paper.title }}{% endif %}
    </p>
    <p class="publication-authors">{{ paper.authors | replace: site.author_en, '<strong>Zhenyuan Yang</strong>' }}</p>
    <div class="publication-meta">
      <span class="publication-status status-{{ paper.status | slugify }}">{{ paper.status }}</span>
      {% if paper.venue %}<span>{{ paper.venue }}</span>{% endif %}
      {% if paper.note %}<span>{{ paper.note }}</span>{% endif %}
      <span>{{ paper.year }}</span>
    </div>
  </li>
{% endfor %}
</ol>

## Awards

<ul class="award-list">
{% for award in site.data.awards %}
  <li>
    <span class="award-name">{{ award.name }}</span>
    {% if award.related %}
    <div class="award-related">
      <span class="award-related-context">{{ award.related.title }}</span>
      <span class="award-related-links">
        {% for link in award.related.links %}
        <a href="{{ link.url }}" target="_blank" rel="noopener noreferrer">{{ link.label }} <span aria-hidden="true">↗</span></a>
        {% endfor %}
      </span>
    </div>
    {% endif %}
  </li>
{% endfor %}
</ul>

## Projects

<div class="about-projects">
{% for project in site.data.projects %}
  <a class="about-project" href="{{ project.url }}" target="_blank" rel="noopener noreferrer">
    <strong>{{ project.name }} <span aria-hidden="true">↗</span></strong>
    <span>{{ project.description }}</span>
  </a>
{% endfor %}
</div>

## Skills

<dl class="about-facts">
  <div>
    <dt>Programming</dt>
    <dd>C/C++, Python, Java</dd>
  </div>
  <div>
    <dt>Systems &amp; tooling</dt>
    <dd>Linux, Docker, CMake, GDB, Git</dd>
  </div>
  <div>
    <dt>ML systems</dt>
    <dd>PyTorch, DeepSpeed, TensorRT, CUDA</dd>
  </div>
</dl>

## Personal Interests

- [Dogs](https://www.dogsindepth.com), especially medium and large breeds
- [Basketball](https://en.wikipedia.org/wiki/2019_NBA_Finals), especially the NBA

## Contact

<div class="about-contact" aria-label="Contact and profile links">
  <a href="mailto:{{ site.email }}">Email</a>
  <a href="{{ site.github }}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
  <a href="{{ site.orcid }}" target="_blank" rel="noopener noreferrer">ORCID <span aria-hidden="true">↗</span></a>
</div>

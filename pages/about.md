---
layout: article
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

<ol class="about-timeline">
  <li>
    <span class="about-period">Sep 2025 – Present</span>
    <span class="about-entry">
      <strong>Institute of Software, Chinese Academy of Sciences</strong>
      <span>M.S. in Computer Science and Technology</span>
    </span>
  </li>
  <li>
    <span class="about-period">Sep 2021 – Jun 2025</span>
    <span class="about-entry">
      <strong>Nanjing University</strong>
      <span>B.Eng. in Computer Science and Technology</span>
    </span>
  </li>
</ol>

## Experience

<ol class="about-timeline">
  <li>
    <span class="about-period">Jul 2026 – Present</span>
    <span class="about-entry">
      <strong>Huawei 2012 Laboratories · Central Research Institute</strong>
      <span>Research Intern</span>
    </span>
  </li>
</ol>

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
    <p class="publication-authors">{% include publication-authors.html authors=paper.authors %}</p>
    <div class="publication-meta">
      <span{% if paper.status == "Published" %} class="status-published"{% endif %}>{{ paper.status }}</span>
      {% if paper.venue %}<span>{{ paper.venue }}</span>{% endif %}
      {% if paper.note %}<span>{{ paper.note }}</span>{% endif %}
      <span>{{ paper.year }}</span>
    </div>
  </li>
{% endfor %}
</ol>

## Awards

{% include award-list.html %}

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

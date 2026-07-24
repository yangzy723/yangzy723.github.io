---
layout: mypost
title: About
lang: en
description: Biography, research interests, publications, projects, experience, and contact information for Zhenyuan Yang.
permalink: /pages/about.html
---

I am a master's student at the Institute of Software, Chinese Academy of Sciences (ISCAS), working on AI systems and high-performance infrastructure. My current interests center on efficient inference for resource-constrained devices, predictable GPU sharing, and edge–cloud collaboration.

I use this site to document research ideas, implementation notes, and lessons learned while building systems.

## Education

| Period | Institution | Program |
| --- | --- | --- |
| Sep 2025 – Present | Institute of Software, Chinese Academy of Sciences | M.S. in Computer Science and Technology |
| Sep 2021 – Jun 2025 | Nanjing University | B.Eng. in Computer Science and Technology |

## Experience

| Period | Organization | Role |
| --- | --- | --- |
| Jul 2026 – Present | Huawei 2012 Lab, Central Research Institute | Research Intern |

## Research Interests

- Efficient inference for resource-constrained edge devices
- Flexible and predictable spatial multiplexing on modern GPUs
- Communication and scheduling for edge–cloud collaborative systems

## Selected Research

{% for paper in site.data.publications %}
- {{ paper.authors }}. {% if paper.url %}[{{ paper.title }}]({{ paper.url }}){% else %}{{ paper.title }}{% endif %}.{% if paper.status %} [{{ paper.status | replace: "_", " " | capitalize }}]{% endif %}{% if paper.venue %} *{{ paper.venue }}*{% endif %}{% if paper.note %}, {{ paper.note }}{% endif %}{% if paper.year %}, {{ paper.year }}{% endif %}.
{% endfor %}

## Projects

{% for project in site.data.projects %}
- [{{ project.name }}]({{ project.url }}) — {{ project.description }}
{% endfor %}

## Awards

{% for award in site.data.awards %}
- {{ award }}
{% endfor %}

## Skills

- Languages: C/C++, Python, Java
- Systems: Linux, Docker, CMake, GDB, Git
- AI Infra: PyTorch, DeepSpeed, TensorRT, CUDA

## Personal Interests

- [Dogs](https://www.dogsindepth.com), especially medium and large breeds
- [Basketball](https://en.wikipedia.org/wiki/2019_NBA_Finals)

## Contact

- Email: [{{ site.email }}](mailto:{{ site.email }})
- GitHub: [github.com/yangzy723]({{ site.github }})
- ORCID: [0009-0008-3110-8715]({{ site.orcid }})

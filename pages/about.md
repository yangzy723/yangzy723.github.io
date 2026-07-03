---
layout: mypost
title: About
---

I am an M.S. student at the Institute of Software, Chinese Academy of Sciences, focusing on AI systems and high-performance infrastructure. This site contains my research notes, engineering write-ups, and selected work.

## Education

| Period | Institution | Program |
| --- | --- | --- |
| 2021.09 - 2025.06 | Nanjing University | B.Eng. in Computer Science and Technology |
| 2025.09 - Present | Institute of Software, Chinese Academy of Sciences | M.S. in Computer Science and Technology |

## Awards

{% for award in site.data.awards %}
- {{ award }}
{% endfor %}

## Research Interests

- Efficient inference for edge and resource-constrained systems
- Communication and scheduling for edge-cloud collaborative systems
- Performance isolation and determinism in GPU sharing

## Selected Works
{% for paper in site.data.publications %}
- {{ paper.authors }}. {% if paper.url %}[{{ paper.title }}]({{ paper.url }}){% else %}{{ paper.title }}{% endif %}.{% if paper.venue %} *{{ paper.venue }}*{% endif %}{% if paper.note %}, {{ paper.note }}{% endif %}.
{% endfor %}

## Projects

{% for project in site.data.projects %}
- {{ project.name }}: {{ project.description }} [GitHub]({{ project.url }})
{% endfor %}

## Skills

- Languages: Java, C, C++, Python
- Systems: Linux, Docker, CMake, GDB, Git
- AI Infra: PyTorch, DeepSpeed, TensorRT, CUDA

## Personal Interests

- [Dogs](https://www.dogsindepth.com), especially medium and large breeds
- [Basketball](https://en.wikipedia.org/wiki/2019_NBA_Finals)

## Contact

- Email: [yangzy723@gmail.com](mailto:yangzy723@gmail.com)
- GitHub: [github.com/yangzy723](https://github.com/yangzy723)
- ORCID: [0009-0008-3110-8715](https://orcid.org/0009-0008-3110-8715)
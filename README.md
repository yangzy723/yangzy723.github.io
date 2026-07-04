# Personal Site

Personal academic website powered by Jekyll.

- Site: https://yangzy723.github.io
- Focus: research notes, engineering write-ups, selected publications/projects, and recent writing

## Local Development

### Prerequisites

- Conda (Miniconda or Anaconda)
- Ruby: 3.2.x (installed in conda env)
- Bundler: 2.4.22 (matches Gemfile.lock)

### 1. Install dependencies

Use this exact setup (macOS/Linux, conda):

```bash
conda create -n homepage -c conda-forge ruby=3.2 -y
conda activate homepage

which ruby
ruby --version

gem install bundler -v 2.4.22
bundle install
```

If your shell still resolves `/usr/bin/ruby`, use explicit binaries from conda env:

```bash
"$CONDA_PREFIX/bin/gem" install bundler -v 2.4.22
"$CONDA_PREFIX/bin/bundle" _2.4.22_ install
```

Optional mirror setup (China mainland network):

```bash
bundle config mirror.https://rubygems.org https://mirrors.tuna.tsinghua.edu.cn/rubygems
bundle install
```

### 2. Run local server

```bash
conda activate homepage
bundle _2.4.22_ exec jekyll serve --watch --host=127.0.0.1 --port=8080
```

Open http://127.0.0.1:8080.

### 3. Build static output

```bash
conda activate homepage
bundle _2.4.22_ exec jekyll build --destination=dist
```

## Content Workflow

### Write a new post

Create a markdown file in [_posts](_posts) with filename pattern:

```text
yyyy-MM-dd-title.md
```

Front matter example:

```yaml
---
layout: mypost
title: My Post Title
categories: [Category1, Category2]
---
```

### Add post assets

Place post assets under [posts](posts), typically by date path:

```text
posts/yyyy/mm/dd/
```

Then reference assets directly in markdown.

### Profile and Branding Update Guide

When updating profile information, keep these locations aligned:

1. Hero name and intro: [index.html](index.html)
2. Header small name and SEO fields: [_config.yml](_config.yml)
3. Full CV-like details: [pages/about.md](pages/about.md)
4. Homepage cards (Publications/Projects/Awards): [index.html](index.html)
5. Publications data: [_data/publications.yml](_data/publications.yml)
6. Projects data: [_data/projects.yml](_data/projects.yml)
7. Awards data: [_data/awards.yml](_data/awards.yml)

## Credits

Based on the Jekyll theme tmaize-blog:

- https://github.com/TMaize/tmaize-blog

Customized for personal academic homepage layout and research-oriented content organization.

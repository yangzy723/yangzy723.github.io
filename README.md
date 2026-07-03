# Zhenyuan Yang Personal Site

Personal academic website powered by Jekyll.

- Site: https://yangzy723.github.io
- Focus: research notes, engineering write-ups, selected publications/projects, and recent writing

## Local Development

### Prerequisites

- Ruby: >= 2.7.0 (required by jekyll 4.4.x)
- Bundler: 2.4.22 (matches Gemfile.lock)

Recommended on macOS:

- Do not rely on system Ruby (/usr/bin/ruby 2.6)
- Use a Ruby version manager (rbenv or asdf), then install Ruby 3.2+

### 1. Install dependencies

macOS/Linux:

```bash
gem install bundler -v 2.4.22
bundle install
```

Optional mirror setup (China mainland network):

```bash
bundle config mirror.https://rubygems.org https://mirrors.tuna.tsinghua.edu.cn/rubygems
bundle install
```

### 2. Run local server

```bash
bundle exec jekyll serve --watch --host=127.0.0.1 --port=8080
```

Open http://127.0.0.1:8080.

### 3. Build static output

```bash
bundle exec jekyll build --destination=dist
```

### Troubleshooting

If you see:

Could not find bundler (2.4.22) required by Gemfile.lock

Run:

```bash
gem install --user-install bundler -v 2.4.22
export PATH="$HOME/.gem/ruby/2.6.0/bin:$PATH"
bundle _2.4.22_ install
```

If you then see:

jekyll >= 4.4.0 depends on Ruby >= 2.7.0

Your Ruby is too old. Install newer Ruby with rbenv (recommended):

```bash
brew install rbenv ruby-build
rbenv install 3.2.6
rbenv local 3.2.6
gem install bundler -v 2.4.22
bundle _2.4.22_ install
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

## Profile and Branding Update Guide

When updating profile information, keep these locations aligned:

1. Hero name and intro: [index.html](index.html)
2. Header small name and SEO fields: [_config.yml](_config.yml)
3. Full CV-like details: [pages/about.md](pages/about.md)
4. Publications list: [_data/publications.yml](_data/publications.yml)

## Deployment Notes

This repository is intended for GitHub Pages style deployment.

- If using username domain, use repository name username.github.io
- If using custom domain, configure DNS and CNAME accordingly

## Credits

Based on the Jekyll theme tmaize-blog:

- https://github.com/TMaize/tmaize-blog

Customized for personal academic homepage layout, bilingual profile display, and research-oriented content organization.

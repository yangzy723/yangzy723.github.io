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
4. Homepage cards (Publications/Projects/Awards): [index.html](index.html)
5. Publications data: [_data/publications.yml](_data/publications.yml)
6. Projects data: [_data/projects.yml](_data/projects.yml)
7. Awards data: [_data/awards.yml](_data/awards.yml)

## Data Model

### Publications

Publications are stored in [_data/publications.yml](_data/publications.yml) and rendered in both [index.html](index.html) and [pages/about.md](pages/about.md).

Recommended fields:

- authors: full author string
- title: paper title
- status: one of under_review / preprint / published
- venue: conference, journal, or platform (for example, arXiv)
- note: volume, issue, pages, or identifier
- year: publication/release year (number)
- url: optional external link

Example:

```yaml
- authors: "A, B, C"
	title: "Example Paper"
	status: "published"
	venue: "Example Journal"
	note: "12(3):45-67"
	year: 2026
	url: "https://example.org"
```

## Deployment Notes

This repository is intended for GitHub Pages style deployment.

- If using username domain, use repository name username.github.io
- If using custom domain, configure DNS and CNAME accordingly

### GitHub Pages Actions Failure: "Deployment failed, try again later"

If GitHub Actions shows this at the `deploy-pages` step:

- This is often a temporary GitHub Pages service-side failure.
- A warning like `punycode module is deprecated` is usually not the root cause.

Recommended checks:

1. Re-run failed workflow jobs from Actions.
2. Confirm repository Pages source is set to GitHub Actions.
3. Confirm build succeeds locally:

```bash
bundle exec jekyll build
```

4. Confirm latest commit is pushed to `main`.
5. After deployment succeeds, hard refresh browser cache (`Cmd+Shift+R` on macOS).

## Credits

Based on the Jekyll theme tmaize-blog:

- https://github.com/TMaize/tmaize-blog

Customized for personal academic homepage layout and research-oriented content organization.

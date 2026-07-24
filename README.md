# Zhenyuan Yang — Personal Academic Site

Personal academic website powered by Jekyll, focused on operating systems, machine learning systems, engineering notes,
publications, and open-source projects.

- Live site: <https://yangzy723.github.io>
- Runtime: Jekyll 4.4 on Ruby 3.2
- Local environment: conda `agent`

## Local Development

The repository includes [environment.yml](environment.yml) for the native Ruby toolchain and
[Gemfile.lock](Gemfile.lock) for reproducible Jekyll dependencies.

### 1. Prepare the conda `agent` environment

For the existing `agent` environment:

```bash
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  conda env update -n agent -f environment.yml
conda activate agent
hash -r
```

On a new machine where `agent` does not exist:

```bash
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  conda env create -f environment.yml
conda activate agent
```

Install the Bundler version recorded in the lockfile and the project gems:

```bash
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  "$CONDA_PREFIX/bin/gem" install bundler -v 2.4.22 --no-document --force
env -u HTTP_PROXY -u HTTPS_PROXY -u http_proxy -u https_proxy \
  "$CONDA_PREFIX/bin/bundle" _2.4.22_ install
```

Verify that the environment is being used:

```bash
"$CONDA_PREFIX/bin/ruby" --version
"$CONDA_PREFIX/bin/bundle" _2.4.22_ --version
"$CONDA_PREFIX/bin/bundle" _2.4.22_ exec jekyll --version
```

The explicit `$CONDA_PREFIX/bin/...` paths prevent macOS `/usr/bin/ruby` from being selected when
the shell has cached or reordered command paths.

### 2. Run the local server

```bash
conda activate agent
"$CONDA_PREFIX/bin/bundle" _2.4.22_ exec jekyll serve \
  --watch --host=127.0.0.1 --port=8080
```

Open <http://127.0.0.1:8080>. Changes to pages, posts, data, CSS, and JavaScript are rebuilt
automatically.

### 3. Build the production output

```bash
conda activate agent
JEKYLL_ENV=production "$CONDA_PREFIX/bin/bundle" _2.4.22_ exec jekyll build \
  --destination=dist
```

The generated `dist/` directory is ignored by Git.

## Content Workflow

### Write a new post

Create a Markdown file in [_posts](_posts) using the filename pattern:

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

Place post assets under [posts](posts), typically using a date path such as
`posts/yyyy/mm/dd/`, then reference them directly from Markdown.

### Keep profile content aligned

When updating profile information, check these sources together:

1. Homepage introduction: [index.html](index.html)
2. Site identity, navigation, and SEO: [_config.yml](_config.yml)
3. Full profile and research history: [pages/about.md](pages/about.md)
4. Publications: [_data/publications.yml](_data/publications.yml)
5. Projects: [_data/projects.yml](_data/projects.yml)
6. Awards: [_data/awards.yml](_data/awards.yml)

## Project Structure

- `_layouts/` and `_includes/`: shared page shell, navigation, footer, and article layout
- `_data/`: structured homepage and profile content
- `static/css/`: design tokens, responsive layouts, post styles, and dark theme
- `static/js/`: theme switching, search, image preview, and accessibility enhancements
- `_posts/` and `posts/`: articles and their assets

## Credits

Originally based on [TMaize/tmaize-blog](https://github.com/TMaize/tmaize-blog), then customized
for a research-oriented personal homepage.

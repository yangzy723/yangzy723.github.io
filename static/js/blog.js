;(function () {
  'use strict'

  var isChinese = document.documentElement.lang.toLowerCase().indexOf('zh') === 0

  function translate(english, chinese) {
    return isChinese ? chinese : english
  }

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true })
    } else {
      callback()
    }
  }

  function setStoredTheme(value) {
    try {
      if (value === null) localStorage.removeItem('darkMode')
      else localStorage.setItem('darkMode', value)
    } catch (error) {
      // Theme switching still works for the current page when storage is unavailable.
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem('darkMode')
    } catch (error) {
      return null
    }
  }

  function initThemeToggle() {
    var toggle = document.querySelector('.theme-toggler')
    if (!toggle) return

    var icon = toggle.querySelector('.svg-icon')
    var media = window.matchMedia('(prefers-color-scheme: dark)')

    function renderToggle() {
      var action = blog.darkMode ? 'light' : 'dark'
      var label = isChinese
        ? '切换到' + (blog.darkMode ? '浅色' : '深色') + '模式'
        : 'Switch to ' + action + ' mode'
      icon.classList.toggle('icon-theme-light', blog.darkMode)
      icon.classList.toggle('icon-theme-dark', !blog.darkMode)
      toggle.setAttribute('aria-label', label)
      toggle.setAttribute('title', label)
      toggle.setAttribute('aria-pressed', String(blog.darkMode))
    }

    function applyTheme(value) {
      document.documentElement.setAttribute('transition', '')
      blog.initDarkMode(value)
      renderToggle()
      window.setTimeout(function () {
        document.documentElement.removeAttribute('transition')
      }, 360)
    }

    toggle.removeAttribute('hidden')
    renderToggle()

    toggle.addEventListener('click', function () {
      var nextValue = blog.darkMode ? 'false' : 'true'
      setStoredTheme(nextValue)
      applyTheme(nextValue)
    })

    function handleSystemTheme(event) {
      if (getStoredTheme() === null) {
        applyTheme(event.matches ? 'true' : 'false')
      }
    }

    if (media.addEventListener) media.addEventListener('change', handleSystemTheme)
    else if (media.addListener) media.addListener(handleSystemTheme)
  }

  function initBackToTop() {
    var button = document.querySelector('.to-top')
    if (!button) return

    var ticking = false
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    function update() {
      button.classList.toggle('show', window.scrollY > 560)
      ticking = false
    }

    button.removeAttribute('hidden')
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(update)
          ticking = true
        }
      },
      { passive: true }
    )

    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' })
    })

    update()
  }

  function wrapTables() {
    var tables = document.querySelectorAll('.page-post .post > table')
    tables.forEach(function (table) {
      if (table.parentElement.classList.contains('table-container')) return
      var wrapper = document.createElement('div')
      wrapper.className = 'table-container'
      wrapper.setAttribute('role', 'region')
      wrapper.setAttribute('aria-label', translate('Scrollable table', '可横向滚动的表格'))
      wrapper.setAttribute('tabindex', '0')
      table.parentNode.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    })
  }

  function addHeadingAnchors() {
    var headings = document.querySelectorAll('.page-post .post h1[id], .page-post .post h2[id], .page-post .post h3[id]')
    headings.forEach(function (heading) {
      if (heading.querySelector('.heading-anchor')) return
      var anchor = document.createElement('a')
      anchor.className = 'heading-anchor'
      anchor.href = '#' + encodeURIComponent(heading.id)
      anchor.textContent = '#'
      anchor.setAttribute(
        'aria-label',
        translate('Link to “', '链接到“') + heading.textContent.trim() + '”'
      )
      heading.appendChild(anchor)
    })
  }

  function initImageDialog() {
    if (!window.HTMLDialogElement) return

    var images = document.querySelectorAll(".page-post .post img:not([alt='line'])")
    if (!images.length) return

    var dialog = document.createElement('dialog')
    var preview = document.createElement('img')
    var close = document.createElement('button')
    var activeImage = null

    dialog.className = 'image-dialog'
    dialog.setAttribute('aria-label', translate('Image preview', '图片预览'))
    preview.alt = ''
    close.className = 'image-dialog-close'
    close.type = 'button'
    close.textContent = '×'
    close.setAttribute('aria-label', translate('Close image preview', '关闭图片预览'))
    dialog.appendChild(preview)
    dialog.appendChild(close)
    document.body.appendChild(dialog)

    function openDialog(image) {
      activeImage = image
      preview.src = image.currentSrc || image.src
      preview.alt = image.alt || translate('Expanded article image', '放大的文章图片')
      dialog.showModal()
    }

    function closeDialog() {
      if (dialog.open) dialog.close()
    }

    close.addEventListener('click', closeDialog)
    preview.addEventListener('click', closeDialog)
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog()
    })
    dialog.addEventListener('close', function () {
      preview.removeAttribute('src')
      if (activeImage) activeImage.focus()
      activeImage = null
    })

    images.forEach(function (image) {
      if (image.closest('a')) return
      image.setAttribute('tabindex', '0')
      image.setAttribute('role', 'button')
      image.setAttribute(
        'aria-label',
        image.alt
          ? translate('Enlarge image: ', '放大图片：') + image.alt
          : translate('Enlarge image', '放大图片')
      )
      image.addEventListener('click', function () {
        openDialog(image)
      })
      image.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openDialog(image)
        }
      })
    })
  }

  ready(function () {
    initThemeToggle()
    initBackToTop()
    wrapTables()
    addHeadingAnchors()
    initImageDialog()
  })
})()

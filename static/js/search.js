blog.addLoadEvent(function () {
  var input = document.getElementById('search-input')
  if (!input) return

  var loadingIcon = document.querySelector('.page-search .icon-loading')
  var items = document.querySelectorAll('.list-search li')
  var rawTitles = []
  var contents = null
  var pendingPromise = null
  var inputLock = false
  var debounceTimer = null
  var CACHE_KEY = 'search_db'
  var CACHE_VERSION_KEY = 'search_db_version'
  var cacheVersion = blog.buildAt || 'static'

  for (var i = 0; i < items.length; i++) {
    var titleEl = items[i].querySelector('.title')
    rawTitles.push(titleEl ? titleEl.textContent || '' : '')
  }

  function setLoading(isLoading) {
    if (!loadingIcon) return
    loadingIcon.style.opacity = isLoading ? 1 : 0
  }

  function parseContent(xmlText) {
    var arr = []
    if (!xmlText) return arr

    try {
      var xml = new DOMParser().parseFromString(xmlText, 'application/xml')
      var nodes = xml.querySelectorAll('li')
      for (var i = 0; i < nodes.length; i++) {
        arr.push(nodes[i].textContent || '')
      }
      return arr
    } catch (e) {
      return arr
    }
  }

  function ensureContentLoaded() {
    if (contents) return Promise.resolve(contents)
    if (pendingPromise) return pendingPromise

    var cachedVersion = localStorage.getItem(CACHE_VERSION_KEY)
    var cachedData = localStorage.getItem(CACHE_KEY)
    if (cachedData && cachedVersion === cacheVersion) {
      contents = parseContent(cachedData)
      return Promise.resolve(contents)
    }

    setLoading(true)
    pendingPromise = new Promise(function (resolve) {
      blog.ajax(
        {
          timeout: 20000,
          url: blog.baseurl + '/static/xml/search.xml'
        },
        function (data) {
          try {
            localStorage.setItem(CACHE_KEY, data)
            localStorage.setItem(CACHE_VERSION_KEY, cacheVersion)
          } catch (e) {
            // ignore storage quota errors
          }
          contents = parseContent(data)
          setLoading(false)
          pendingPromise = null
          resolve(contents)
        },
        function () {
          setLoading(false)
          pendingPromise = null
          resolve([])
        }
      )
    })

    return pendingPromise
  }

  function hideAll() {
    for (var i = 0; i < items.length; i++) {
      var titleEl = items[i].querySelector('.title')
      var contentEl = items[i].querySelector('.content')
      if (titleEl) titleEl.textContent = rawTitles[i] || ''
      if (contentEl) contentEl.textContent = ''
      items[i].setAttribute('hidden', true)
    }
  }

  function runSearch(keyword) {
    var key = blog.trim(keyword || '')
    key = key.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')

    if (!key) {
      hideAll()
      return
    }

    var markStart = '<span class="hint">'
    var markEnd = '</span>'
    var keyRegGlobal = new RegExp(blog.encodeRegChar(key), 'gi')
    var keyRegSingle = new RegExp(blog.encodeRegChar(key), 'i')

    for (var i = 0; i < items.length; i++) {
      var title = rawTitles[i] || ''
      var content = (contents && contents[i]) || ''
      var li = items[i]
      var titleEl = li.querySelector('.title')
      var contentEl = li.querySelector('.content')
      var matched = false

      if (titleEl) titleEl.textContent = title
      if (contentEl) contentEl.textContent = ''

      if (keyRegSingle.test(title)) {
        matched = true
        if (titleEl) titleEl.innerHTML = title.replace(keyRegGlobal, markStart + key + markEnd)
      }

      var contentMatch = keyRegSingle.exec(content)
      if (contentMatch) {
        matched = true
        var idx = contentMatch.index
        var start = Math.max(0, idx - 10)
        var end = Math.min(content.length, idx + 90)
        var snippet = content.substring(start, end)
        if (contentEl) contentEl.innerHTML = snippet.replace(keyRegGlobal, markStart + key + markEnd) + '...'
      } else if (matched && content && contentEl) {
        contentEl.textContent = content.substring(0, 100) + '...'
      }

      if (matched) li.removeAttribute('hidden')
      else li.setAttribute('hidden', true)
    }
  }

  function handleInput(value) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(function () {
      if (!blog.trim(value || '')) {
        hideAll()
        return
      }
      ensureContentLoaded().then(function () {
        runSearch(value)
      })
    }, 140)
  }

  hideAll()

  blog.addEvent(input, 'input', function (event) {
    if (!inputLock) handleInput(event.target.value)
  })

  blog.addEvent(input, 'compositionstart', function () {
    inputLock = true
  })

  blog.addEvent(input, 'compositionend', function (event) {
    inputLock = false
    handleInput(event.target.value)
  })
})

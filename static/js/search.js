;(function () {
  'use strict'

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true })
    } else {
      callback()
    }
  }

  ready(function () {
    var input = document.getElementById('search-input')
    if (!input) return

    var list = document.querySelector('.list-search')
    var items = Array.from(document.querySelectorAll('.list-search li'))
    var loadingIcon = document.querySelector('.search-results-head .icon-loading')
    var status = document.getElementById('search-status')
    var clearButton = document.querySelector('.search-clear')
    var emptyState = document.querySelector('.search-empty')
    var titles = items.map(function (item) {
      return item.querySelector('.title').textContent.trim()
    })
    var contents = null
    var pendingRequest = null
    var debounceTimer = null
    var composing = false
    var cacheKey = 'search_db_v2'
    var cacheVersionKey = 'search_db_version_v2'
    var cacheVersion = blog.buildAt || 'static'

    function setLoading(isLoading) {
      list.setAttribute('aria-busy', String(isLoading))
      loadingIcon.classList.toggle('is-loading', isLoading)
    }

    function setStatus(message) {
      status.textContent = message
    }

    function getCachedContents() {
      try {
        if (localStorage.getItem(cacheVersionKey) !== cacheVersion) return null
        var value = localStorage.getItem(cacheKey)
        return value ? JSON.parse(value) : null
      } catch (error) {
        return null
      }
    }

    function storeContents(value) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(value))
        localStorage.setItem(cacheVersionKey, cacheVersion)
      } catch (error) {
        // Search remains functional if browser storage is unavailable or full.
      }
    }

    function parseSearchDocument(xmlText) {
      var xml = new DOMParser().parseFromString(xmlText, 'application/xml')
      if (xml.querySelector('parsererror')) throw new Error('Invalid search index')
      return Array.from(xml.querySelectorAll('li')).map(function (node) {
        return node.textContent.replace(/\s+/g, ' ').trim()
      })
    }

    function loadContents() {
      if (contents) return Promise.resolve(contents)
      if (pendingRequest) return pendingRequest

      var cached = getCachedContents()
      if (cached && cached.length === items.length) {
        contents = cached
        return Promise.resolve(contents)
      }

      setLoading(true)
      setStatus('Loading article index…')
      pendingRequest = fetch(blog.baseurl + '/static/xml/search.xml', { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('Search index request failed')
          return response.text()
        })
        .then(parseSearchDocument)
        .then(function (value) {
          contents = value
          storeContents(value)
          return value
        })
        .finally(function () {
          pendingRequest = null
          setLoading(false)
        })

      return pendingRequest
    }

    function hideResults() {
      items.forEach(function (item, index) {
        item.hidden = true
        item.querySelector('.title').textContent = titles[index]
        item.querySelector('.content').textContent = ''
      })
    }

    function appendHighlighted(element, text, keyword) {
      element.textContent = ''
      var lowerText = text.toLocaleLowerCase()
      var lowerKeyword = keyword.toLocaleLowerCase()
      var start = 0
      var matchIndex = lowerText.indexOf(lowerKeyword, start)

      while (matchIndex !== -1) {
        element.appendChild(document.createTextNode(text.slice(start, matchIndex)))
        var mark = document.createElement('mark')
        mark.textContent = text.slice(matchIndex, matchIndex + keyword.length)
        element.appendChild(mark)
        start = matchIndex + keyword.length
        matchIndex = lowerText.indexOf(lowerKeyword, start)
      }

      element.appendChild(document.createTextNode(text.slice(start)))
    }

    function createSnippet(content, matchIndex) {
      if (!content) return ''
      var start = matchIndex >= 0 ? Math.max(0, matchIndex - 45) : 0
      var end = Math.min(content.length, start + 170)
      return (start > 0 ? '…' : '') + content.slice(start, end).trim() + (end < content.length ? '…' : '')
    }

    function runSearch(rawKeyword) {
      var keyword = rawKeyword.trim()
      if (!keyword) {
        hideResults()
        emptyState.hidden = false
        emptyState.textContent = 'Your matches will appear here.'
        setStatus('Enter a keyword to begin.')
        return
      }

      var lowerKeyword = keyword.toLocaleLowerCase()
      var resultCount = 0

      items.forEach(function (item, index) {
        var title = titles[index]
        var content = contents[index] || ''
        var titleMatch = title.toLocaleLowerCase().indexOf(lowerKeyword)
        var contentMatch = content.toLocaleLowerCase().indexOf(lowerKeyword)
        var matched = titleMatch !== -1 || contentMatch !== -1
        var titleElement = item.querySelector('.title')
        var contentElement = item.querySelector('.content')

        if (!matched) {
          item.hidden = true
          return
        }

        appendHighlighted(titleElement, title, keyword)
        var snippet = createSnippet(content, contentMatch)
        if (snippet) appendHighlighted(contentElement, snippet, keyword)
        else contentElement.textContent = ''
        item.hidden = false
        resultCount += 1
      })

      emptyState.hidden = resultCount > 0
      emptyState.textContent = 'No articles matched “' + keyword + '”. Try a shorter or broader term.'
      setStatus(resultCount + (resultCount === 1 ? ' result' : ' results') + ' for “' + keyword + '”.')
    }

    function updateUrl(keyword) {
      if (!window.history.replaceState) return
      var url = new URL(window.location.href)
      if (keyword.trim()) url.searchParams.set('q', keyword.trim())
      else url.searchParams.delete('q')
      window.history.replaceState({}, '', url.pathname + url.search + url.hash)
    }

    function search(value) {
      window.clearTimeout(debounceTimer)
      clearButton.hidden = !value

      debounceTimer = window.setTimeout(function () {
        updateUrl(value)
        if (!value.trim()) {
          runSearch('')
          return
        }

        loadContents()
          .then(function () {
            runSearch(value)
          })
          .catch(function () {
            hideResults()
            emptyState.hidden = false
            emptyState.textContent = 'The search index could not be loaded. Please refresh and try again.'
            setStatus('Search is temporarily unavailable.')
          })
      }, 160)
    }

    hideResults()
    emptyState.hidden = false

    input.addEventListener('input', function (event) {
      if (!composing) search(event.target.value)
    })

    input.addEventListener('compositionstart', function () {
      composing = true
    })

    input.addEventListener('compositionend', function (event) {
      composing = false
      search(event.target.value)
    })

    clearButton.addEventListener('click', function () {
      input.value = ''
      search('')
      input.focus()
    })

    document.addEventListener('keydown', function (event) {
      var target = event.target
      var isTyping = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
      if (event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        input.focus()
      }
    })

    var initialQuery = new URL(window.location.href).searchParams.get('q')
    if (initialQuery) {
      input.value = initialQuery
      search(initialQuery)
    }
  })
})()

;(function () {
  'use strict'

  var form = document.querySelector('.search-form')
  var input = document.getElementById('search-input')
  var list = document.querySelector('.list-search')
  var items = Array.from(list.querySelectorAll('li'))
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
  var searchRevision = 0

  function setLoading(isLoading) {
    list.setAttribute('aria-busy', String(isLoading))
    loadingIcon.classList.toggle('is-loading', isLoading)
  }

  function setStatus(message) {
    status.textContent = message
  }

  function loadContents() {
    if (contents) return Promise.resolve(contents)
    if (pendingRequest) return pendingRequest

    setLoading(true)
    setStatus('Loading article index…')
    pendingRequest = fetch(window.blog.baseurl + '/static/search-index.json', {
      credentials: 'same-origin'
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Search index request failed')
        return response.json()
      })
      .then(function (value) {
        var valid =
          Array.isArray(value) &&
          value.length === items.length &&
          value.every(function (entry) {
            return typeof entry === 'string'
          })
        if (!valid) throw new Error('Invalid search index')
        contents = value
        return contents
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
    var matchIndex = lowerText.indexOf(lowerKeyword)

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
      var content = contents[index]
      var titleMatch = title.toLocaleLowerCase().indexOf(lowerKeyword)
      var contentMatch = content.toLocaleLowerCase().indexOf(lowerKeyword)
      var titleElement = item.querySelector('.title')
      var contentElement = item.querySelector('.content')

      if (titleMatch === -1 && contentMatch === -1) {
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
    var url = new URL(window.location.href)
    if (keyword) url.searchParams.set('q', keyword)
    else url.searchParams.delete('q')
    window.history.replaceState({}, '', url.pathname + url.search + url.hash)
  }

  function search(value) {
    var keyword = value.trim()
    var revision = ++searchRevision
    window.clearTimeout(debounceTimer)
    clearButton.hidden = !keyword

    debounceTimer = window.setTimeout(function () {
      updateUrl(keyword)
      if (!keyword) {
        runSearch('')
        return
      }

      loadContents()
        .then(function () {
          if (revision === searchRevision) runSearch(keyword)
        })
        .catch(function () {
          if (revision !== searchRevision) return
          hideResults()
          emptyState.hidden = false
          emptyState.textContent = 'The search index could not be loaded. Please refresh and try again.'
          setStatus('Search is temporarily unavailable.')
        })
    }, 160)
  }

  hideResults()
  emptyState.hidden = false

  form.addEventListener('submit', function (event) {
    event.preventDefault()
    search(input.value)
  })

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
})()

;(function () {
  'use strict'

  var form = document.querySelector('.search-form')
  var input = document.getElementById('search-input')
  var list = document.querySelector('.list-search')
  var loadingIcon = document.querySelector('.search-results-head .icon-loading')
  var status = document.getElementById('search-status')
  var clearButton = document.querySelector('.search-clear')
  var emptyState = document.querySelector('.search-empty')
  var documents = null
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

  function isValidDocument(entry) {
    return (
      entry &&
      typeof entry.title === 'string' &&
      typeof entry.url === 'string' &&
      typeof entry.date === 'string' &&
      typeof entry.category === 'string' &&
      typeof entry.content === 'string'
    )
  }

  function loadDocuments() {
    if (documents) return Promise.resolve(documents)
    if (pendingRequest) return pendingRequest

    setLoading(true)
    setStatus('Loading article index…')
    pendingRequest = fetch(window.blog.searchIndexUrl)
      .then(function (response) {
        if (!response.ok) throw new Error('Search index request failed')
        return response.json()
      })
      .then(function (value) {
        if (!Array.isArray(value) || !value.every(isValidDocument)) {
          throw new Error('Invalid search index')
        }
        documents = value
        return documents
      })
      .finally(function () {
        pendingRequest = null
        setLoading(false)
      })

    return pendingRequest
  }

  function clearResults() {
    list.textContent = ''
  }

  function appendHighlighted(element, text, keyword) {
    element.textContent = ''
    var lowerText = text.toLowerCase()
    var lowerKeyword = keyword.toLowerCase()
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

  function createResult(entry, keyword, lowerKeyword) {
    var titleMatch = entry.title.toLowerCase().indexOf(lowerKeyword)
    var contentMatch = entry.content.toLowerCase().indexOf(lowerKeyword)
    if (titleMatch === -1 && contentMatch === -1) return null

    var item = document.createElement('li')
    var link = document.createElement('a')
    var title = document.createElement('span')
    var meta = document.createElement('span')
    var content = document.createElement('span')

    link.href = entry.url
    title.className = 'title'
    meta.className = 'search-result-meta'
    content.className = 'content'
    appendHighlighted(title, entry.title, keyword)
    meta.textContent = entry.date + (entry.category ? ' · ' + entry.category : '')

    var snippet = createSnippet(entry.content, contentMatch)
    if (snippet) appendHighlighted(content, snippet, keyword)

    link.appendChild(title)
    link.appendChild(meta)
    link.appendChild(content)
    item.appendChild(link)

    return {
      element: item,
      titleMatch: titleMatch !== -1
    }
  }

  function runSearch(keyword) {
    clearResults()

    if (!keyword) {
      emptyState.hidden = false
      emptyState.textContent = 'Your matches will appear here.'
      setStatus('Enter a keyword to begin.')
      return
    }

    var lowerKeyword = keyword.toLowerCase()
    var matches = documents
      .map(function (entry) {
        return createResult(entry, keyword, lowerKeyword)
      })
      .filter(Boolean)

    matches.sort(function (left, right) {
      if (left.titleMatch !== right.titleMatch) return left.titleMatch ? -1 : 1
      return 0
    })

    var fragment = document.createDocumentFragment()
    matches.forEach(function (match) {
      fragment.appendChild(match.element)
    })
    list.appendChild(fragment)

    emptyState.hidden = matches.length > 0
    emptyState.textContent = 'No articles matched “' + keyword + '”. Try a shorter or broader term.'
    setStatus(matches.length + (matches.length === 1 ? ' result' : ' results') + ' for “' + keyword + '”.')
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

    if (!keyword) {
      updateUrl('')
      runSearch('')
      return
    }

    debounceTimer = window.setTimeout(function () {
      updateUrl(keyword)
      loadDocuments()
        .then(function () {
          if (revision === searchRevision) runSearch(keyword)
        })
        .catch(function () {
          if (revision !== searchRevision) return
          clearResults()
          emptyState.hidden = false
          emptyState.textContent = 'The search index could not be loaded. Please refresh and try again.'
          setStatus('Search is temporarily unavailable.')
        })
    }, 160)
  }

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

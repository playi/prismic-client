import test from 'ava'

import * as prismic from '../src'

const endpoint = prismic.getEndpoint('qwerty')

test('includes ref', (t) => {
  t.is(
    prismic.buildQueryURL(endpoint, { ref: 'ref' }),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref',
  )
})

test('supports single predicate', (t) => {
  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        predicates: prismic.predicate.has('my.document.title'),
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&q=[[has(my.document.title)]]',
  )
})

test('supports multiple predicates', (t) => {
  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        predicates: [
          prismic.predicate.has('my.document.title'),
          prismic.predicate.has('my.document.subtitle'),
        ],
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&q=[[has(my.document.title)]]&q=[[has(my.document.subtitle)]]',
  )
})

test('supports params', (t) => {
  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        accessToken: 'accessToken',
        pageSize: 1,
        page: 1,
        after: 'after',
        fetch: 'fetch',
        fetchLinks: 'fetchLinks',
        graphQuery: 'graphQuery',
        lang: 'lang',
        orderings: 'orderings',
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&access_token=accessToken&pageSize=1&page=1&after=after&fetch=fetch&fetchLinks=fetchLinks&graphQuery=graphQuery&lang=lang&orderings=[orderings]',
  )
})

test('supports array fetch param', (t) => {
  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        fetch: ['title', 'subtitle'],
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&fetch=title,subtitle',
  )
})

test('supports array fetchLinks param', (t) => {
  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        fetchLinks: ['page.link', 'page.second_link'],
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&fetchLinks=page.link,page.second_link',
  )
})

test('supports array orderings param', (t) => {
  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        orderings: ['page.title', { field: 'page.subtitle' }],
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&orderings=[page.title,page.subtitle]',
  )
})

test('supports setting direction of ordering param', (t) => {
  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        orderings: ['page.title', { field: 'page.subtitle', direction: 'asc' }],
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&orderings=[page.title,page.subtitle]',
  )

  t.is(
    decodeURIComponent(
      prismic.buildQueryURL(endpoint, {
        ref: 'ref',
        orderings: [
          'page.title',
          { field: 'page.subtitle', direction: 'desc' },
        ],
      }),
    ),
    'https://qwerty.cdn.prismic.io/api/v2/documents/search?ref=ref&orderings=[page.title,page.subtitle+desc]',
  )
})

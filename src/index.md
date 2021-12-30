---
layout: 'home.njk'
title: Home
postsHeading: Recent posts
socialImage: ''
eleventyExcludeFromCollections: true
pagination:
  data: collections.feed
  size: 5
permalink: '{% if pagination.pageNumber > 0 %}page/{{ pagination.pageNumber }}{% endif %}/index.html'
paginationPrevText: 'Newer posts'
paginationNextText: 'Older posts'
paginationAnchor: '#post-list'
---

My name is **Aubrey** and I love knitting, tea, and web development. I code during the day and make my own yarn, write in my journal, and cook tasty food in the evenings.

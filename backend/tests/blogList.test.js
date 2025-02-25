const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes
const totalLikes = require('../utils/list_helper').totalLikes

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('favorite blog', () => {
  const listWithManyBlos = [
    {
      title: 'Fullstack Web Development Program',
      author: 'Helsinki University',
      likes: 150,
    },
    {
      title: 'React patterns and best pratices',
      author: 'John Smith',
      likes: 10,
    },
    {
      title: 'Running tests in a node application',
      author: 'Cristian Silva',
      likes: 13,
    },
    {
      title: 'Building the backend of an application',
      author: 'Stella Johnson',
      likes: 35,
    }
  ]

  test('of many blogs is the one with the most likes', () => {
    const result = favoriteBlog(listWithManyBlos)
    assert.deepStrictEqual(result, {
      title: 'Fullstack Web Development Program',
      author: 'Helsinki University',
      likes: 150
    })
  })
})

describe('most blogs', () => {
  const listOfAuthors = [
    { author: 'Helsinki University', title: 'Mastering Full Stack Development' },
    { author: 'Helsinki University', title: 'Essential Tools for Full Stack Developers' },
    { author: 'Helsinki University', title: 'Building Scalable Full Stack Applications' },
    { author: 'John Smith', title: 'React Hooks: A Comprehensive Guide' },
    { author: 'John Smith', title: 'State Management in React with Redux' },
    { author: 'John Smith', title: 'Optimizing Performance in React Apps' },
    { author: 'John Smith', title: 'React Router: Navigating Your Single Page Application' },
    { author: 'Cristian Silva', title : 'Unit Testing Best Practices' },
    { author: 'Cristian Silva', title : 'Automating Unit Tests for Robust Code' },
    { author: 'Stella Johnson', title : 'Building RESTful APIs with Node.js' }
  ]

  test('of many blogs is the author with the most blogs', () => {
    const result = mostBlogs(listOfAuthors)
    assert.deepStrictEqual(result, {
      author: 'John Smith',
      blogs: 4
    })
  })
})

describe('most likes', () => {
  const listOfAuthors = [
    { author: 'Helsinki University', title: 'Mastering Full Stack Development', likes: 50 },
    { author: 'Helsinki University', title: 'Essential Tools for Full Stack Developers', likes: 33 },
    { author: 'Helsinki University', title: 'Building Scalable Full Stack Applications', likes: 27 },
    { author: 'John Smith', title: 'React Hooks: A Comprehensive Guide', likes: 20 },
    { author: 'John Smith', title: 'State Management in React with Redux', likes: 55 },
    { author: 'John Smith', title: 'Optimizing Performance in React Apps', likes: 32 },
    { author: 'John Smith', title: 'React Router: Navigating Your Single Page Application', likes: 10 },
    { author: 'Cristian Silva', title : 'Unit Testing Best Practices', likes: 9 },
    { author: 'Cristian Silva', title : 'Automating Unit Tests for Robust Code', likes: 18 },
    { author: 'Stella Johnson', title : 'Building RESTful APIs with Node.js', likes: 33 }
  ]

  test('of many blogs is the author with the highest likes', () => {
    const result = mostLikes(listOfAuthors)
    assert.deepStrictEqual(result, {
      author: 'John Smith',
      likes: 117
    })
  })
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = totalLikes([])
    assert.strictEqual(result, 0)
  })

  const listwithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that blog', () => {
    const result = totalLikes(listwithOneBlog)
    assert.strictEqual(result, 5)
  })

  const listWithManyBlos = [
    {
      _id: '5a411bb41b54a676234d17c3',
      title: 'Fullstack Web Development Program',
      author: 'Helsinki University',
      url: 'https://fullstackopen.com/',
      likes: 150,
      __v: 0
    },
    {
      _id: '6y411cc71b54a676234d17g8',
      title: 'React patterns and best pratices',
      author: 'John Smith',
      url: 'https://reactpatterns.com/',
      likes: 10,
      __v: 0
    },
    {
      _id: '3a911cc41b54a656234d14d4',
      title: 'Running tests in a node application',
      author: 'Cristian Silva',
      url: 'https://nodeapps.com/',
      likes: 13,
      __v: 0
    },
    {
      _id: '5e411bb43e55t676454d37e5',
      title: 'Building the backend of an application',
      author: 'Stella Johnson',
      url: 'https://fullstackwebdev.com/',
      likes: 35,
      __v: 0
    }
  ]
  // 150 + 10 + 13 + 35 = 208
  test('of a bigger list is calculated right', () => {
    const result = totalLikes(listWithManyBlos)
    assert.strictEqual(result, 208)
  })
})
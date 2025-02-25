const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')

const api = supertest(app)

let token

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const userForToken = { username: user.username, id: user._id }
    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
    await Blog.insertMany(helper.InitialBlogList)
  })

  test('blog lists are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.InitialBlogList.length)
  })

  test('the first blog is about Initializing db before tests', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(e => e.title)
    assert(titles.includes('Initializing the database before the tests'))
  })

  test('unique identifier property of the blog post is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert(blogs[0].id !== undefined)
    assert(blogs[0]._id === undefined)
  })

  describe('addition of a new blog post', () => {
    test('a new blog post can be added', async () => {
      const newBlog = {
        title: 'The Popular blogger Jenny',
        author: 'Taylor Cooper',
        url: 'https://www.blogenius.com',
        likes: 8
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.InitialBlogList.length + 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(titles.includes('The Popular blogger Jenny'))

      const authors = blogsAtEnd.map(r => r.author)
      assert(authors.includes('Taylor Cooper'))

      const urls = blogsAtEnd.map(r => r.url)
      assert(urls.includes('https://www.blogenius.com'))

      const likes = blogsAtEnd.map(r => r.likes)
      assert(likes.includes(8))
    })

    test('set likes to 0 if its property is missing in request', async () => {
      const newBlog = {
        title: 'A test sample',
        author: 'John Doe',
        url: 'https://www.test.com'
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const newSavedBlog = response.body.likes === undefined ? 0 : response.body.likes
      assert.strictEqual(newSavedBlog, 0)
    })

    test('blogs without a title or url are not added', async () => {
      const newBlog = {
        author: 'John Doe',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.InitialBlogList.length)
    })

    test('adding a blog fails with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Unauthorized blog',
        author: 'John Doe',
        url: 'https://www.unauthorized.com',
        likes: 5
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.InitialBlogList.length)
    })
  })

  describe('Deletion of a blog post', () => {
    test('successfully deletes with status code 204 with valid id', async () => {
      const newBlog = {
        title: 'Blog to be deleted',
        author: 'Author',
        url: 'https://www.delete.com',
        likes: 0
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogToDelete = response.body

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.InitialBlogList.length)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('Updating an existing blog post', () => {
    test('Successfully updates with the status code 200 with valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'How to run tests one by one'
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.InitialBlogList.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
const Blog = require('../models/blog')
const User = require('../models/user')

const InitialBlogList = [
  {
    title: 'Initializing the database before the tests',
    author: 'Millie Con',
    url: 'https://www.codeguro.com',
    likes: '54'
  },
  {
    title: 'How to use the supertest package for testing API',
    author: 'Stella James',
    url: 'https://www.codewitch.com',
    likes: '22'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'Just a non existing list' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { InitialBlogList, nonExistingId, blogsInDb, usersInDb, }
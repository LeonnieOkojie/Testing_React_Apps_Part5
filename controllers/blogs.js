const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')
require('dotenv').config()//loads the environment variables

//For getting all blogs
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
//updating a blog by it's ID
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
    response.json(updatedBlog) //sends the updated blog as JSON
})
//creating a new blog
blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    const user = request.user
    if (!user) {
        return response.status(401).json({ error: 'user not found' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0, //default likes to 0 if not provided
        user: user.id
    })

    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog._id) //adds blog to the user's blogs
    await user.save()

    response.status(201).json(newBlog)
})
//getting a blog using it's ID
blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    console.log('Successfully fetched ', blog)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})
//deleting a blog by ID
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'Blog not amoung the list' })
    }
    const user = request.user
    console.log(user)
    if (!user) {
        return response.status(401).json({ error: 'user not found' })
    }

    if (blog.user && blog.user.toString() === user.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id) // If user owns the blog, delete it
        response.status(204).end()
    } else {
        response.status(403).json({ error: 'Deletion not authorized, permission denied' })
    }
    console.log('Deleted blog post successfully!')
})

module.exports = blogsRouter
const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)  // sums the likes of all the blogs
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => max.likes > blog.likes
    ? max
    : blog, {}) // return the blog with the most likes
}

const _ = require('lodash') // declaring the lodash library

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author') // count the number of blogs by author
  const maxAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author]) // find the author with the most blogs
  return { author: maxAuthor, blogs: authorCounts[maxAuthor] } // return the author with the most blogs
}

const mostLikes = (blogs) => {
  const authorLikes = _.groupBy(blogs, 'author') // group the blogs by the author
  const authorTotalLikes = _.mapValues(authorLikes, (blogs) => totalLikes(blogs)) // calculates the total likes for each author
  const maxAuthor = _.maxBy(_.keys(authorTotalLikes), (author) => authorTotalLikes[author]) // find the author with the most likes
  return { author: maxAuthor, likes: authorTotalLikes[maxAuthor] } // returns the author with the most likes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}


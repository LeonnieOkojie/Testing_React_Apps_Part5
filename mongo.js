const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://PhoneBookFS:${password}@cluster0.3l6wj.mongodb.net/testBlogList?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)


const blog1 = new Blog({
  title: 'Initializing the database before the tests',
  author: 'Millie Con',
  url: 'https://www.codeguro.com',
  likes: 54
})

const blog2 = new Blog({
  title: 'How to use the supertest package for testing API',
  author: 'Stella James',
  url: 'https://www.codewitch.com',
  likes: 22
})


blog1.save().then(result => {
  console.log('blog1 saved!')
  console.log(result)
  blog2.save().then(result => {
    console.log('blog2 saved!')
    console.log(result)
    mongoose.connection.close()
  })
})

/*
Note.find({ important: true }).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})
*/
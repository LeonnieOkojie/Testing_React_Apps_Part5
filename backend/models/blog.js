const mongoose = require('mongoose')
//defines the schema for the blog model
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true //the title of the blog post is required
  },
  author: {
    type: String,
    required: true //the author of the blog post is required
  },
  url: {
    type: String,
    required: true //the url of the blog post is required
  },
  likes: {
    type: Number,
    default: 0 //sets the default value for likes to 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' //reference to the user model
  }
})

//transforms the returned object when converting to JSON
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
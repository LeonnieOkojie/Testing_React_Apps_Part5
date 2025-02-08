const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
//get all users
usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs', { title: 1, author: 1, url: 1 }) //gets all the registered users and include their blogs
    response.json(users)
})
//create a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body //this gets the username, name and password from the request body

  const saltRounds = 10 //sets the number of salt rounds for hashing to 10
  const passwordHash = await bcrypt.hash(password, saltRounds) //hashes the password

  const user = new User({
    username,
    name,
    password: passwordHash, //stores the hashed password
  })

  const savedUser = await user.save()
  if (savedUser){
    response.status(201).json(savedUser)
  }
})

module.exports = usersRouter
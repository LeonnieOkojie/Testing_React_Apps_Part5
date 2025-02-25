import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs))
  }, [])
  console.log('render', blogs.length, 'blogs')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogpostUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createNewBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`A new blog "${newBlog.title}" by ${newBlog.author} added`)
      setType('success')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      setMessage('Error adding blog post, try again.')
      setType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogpostUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials')
      setType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
    console.log('logging in with', username)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogpostUser')
    blogService.setToken(null)
    setUser(null)
  }

  const updateBlogLikes = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
  }

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const loginForm = () => (
    <div>
      <Notification message={message} type={type} />
      <LoginForm
        handleSubmit={handleLogin}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        username={username}
        password={password}
      />
    </div>
  )

  const sortedBlogs = blogs.sort((x, y) => y.likes - x.likes )

  return (
    <div>
      {user === null ? loginForm() :
        <div>
          <h1>blogs</h1>
          <Notification message={message} type={type}/>
          <div>
            <p>{user.name} logged in</p>
            <button type='button' onClick={handleLogout}>logout</button>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
              <BlogForm
                createNewBlog={createNewBlog}
              />
            </Togglable>
            {sortedBlogs.map(blog =>
              <Blog key={blog.id} blog={blog} updateBlogLikes={updateBlogLikes} deleteBlog={deleteBlog} user={user} />
            )}
          </div>
        </div>
      }
    </div>
  )
}

export default App
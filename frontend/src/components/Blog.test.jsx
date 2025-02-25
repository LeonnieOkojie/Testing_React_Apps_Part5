import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import blogService from '../services/blogs'

vi.mock('../services/blogs')

test('renders blogs title and author but not URL or likes by defaults', () => {
  const blog = {
    title: 'React testing library and its uses',
    author: 'Andrew Sparks',
    url: 'http://www.testing.com',
    likes: 8,
    user: {
      id: '246',
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} user={{ username: 'testuser' }} />)

  // Check that the title and author are rendered
  const titleAndAuthorElement = screen.getByText('React testing library and its uses Andrew Sparks')
  expect(titleAndAuthorElement).toBeDefined()

  // Check that the URL and likes are not rendered by default
  const urlElement = screen.queryByText('http://www.testing.com')
  const likesElement = screen.queryByText('likes 8')
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('clicking the view button displays the blogs URL and number of likes', async () => {
  const blog = {
    title: 'React testing library and its uses',
    author: 'Andrew Sparks',
    url: 'http://www.testing.com',
    likes: 8,
    user: {
      id: '246',
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} user={{ username: 'testuser' }} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // Check that the URL and likes are displayed after clicking the view button
  const urlElement = screen.getByText('http://www.testing.com')
  const likesElement = screen.getByText('likes 8')
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'React testing library and its uses',
    author: 'Andrew Sparks',
    url: 'http://www.testing.com',
    likes: 8,
    user: {
      id: '246',
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()
  blogService.update.mockResolvedValue({ ...blog, likes: blog.likes + 1 })

  render(<Blog blog={blog} user={{ username: 'testuser' }} updateBlogLikes={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('checks that the event handler is called with the right details when a new blog is created', async () => {
    const createNewBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createNewBlog={createNewBlog} />)

    const titleInput =screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('URL')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Component Testing and its features')
    await user.type(authorInput, 'James Hart')
    await user.type(urlInput, 'https://www.testing.com')
    await user.click(createButton)

    expect(createNewBlog.mock.calls).toHaveLength(1)
    expect(createNewBlog.mock.calls[0][0]).toEqual({ 
        title: 'Component Testing and its features',
        author: 'James Hart',
        url: 'https://www.testing.com'
    })
})
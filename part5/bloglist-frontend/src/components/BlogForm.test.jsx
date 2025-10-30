import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls the event handler it received as props with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} setErrorMessage={() => { }}/>)

    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('Create')

    await user.type(titleInput, 'New testing blog')
    await user.type(authorInput, 'React Master')
    await user.type(urlInput, 'https://example.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    expect(createBlog.mock.calls[0][0]).toEqual({
        title: 'New testing blog',
        author: 'React Master',
        url: 'https://example.com'
    })
})
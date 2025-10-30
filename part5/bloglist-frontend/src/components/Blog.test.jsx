import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
    const blog = {
        title: 'testing React',
        author: 'React tester',
        url: 'https://example.com',
        likes: 10,
        user: {
            username: 'janedoe',
            name: 'Jane Doe'
        }
    }

    const user = { username: 'janedoe', name: 'Jane Doe' }

    const { container } = render(<Blog blog={blog} user={user} />)

    const hiddenDiv = container.querySelector('.hiddenBlog')
    expect(hiddenDiv).toHaveTextContent('testing React by React tester')

    const visibleDiv = container.querySelector('.visibleBlog')
    expect(visibleDiv).toHaveStyle('display: none')
})

test('shows url and likes when the view button is clicked', async () => {
    const blog = {
        title: 'testing React',
        author: 'React tester',
        url: 'https://example.com',
        likes: 10,
        user: {
            username: 'janedoe',
            name: 'Jane Doe'
        }
    }

    const user = { username: 'janedoe', name: 'Jane Doe' }

    const { container } = render(<Blog blog={blog} user={user} />)
    const userAction = userEvent.setup()

    const button = screen.getByText('view')
    await userAction.click(button)

    const visibleDiv = container.querySelector('.visibleBlog')
    expect(visibleDiv).not.toHaveStyle('display: none')
})

test('when like is clicked two times it calls the controller twice', async () => {
    const blog = {
        title: 'testing React',
        author: 'React tester',
        url: 'https://example.com',
        likes: 10,
        user: {
            username: 'janedoe',
            name: 'Jane Doe'
        }
    }

    const user = { username: 'janedoe', name: 'Jane Doe' }

    const mockHandler = vi.fn()

    const { container } = render(<Blog blog={blog} user={user} handleLike={mockHandler} deleteBlog={() => { }} />)
    const userAction = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userAction.click(viewButton)

    const likeButton = screen.getByText('like')
    await userAction.click(likeButton)
    await userAction.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
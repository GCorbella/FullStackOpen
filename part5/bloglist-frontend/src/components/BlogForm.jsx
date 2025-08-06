import { useState } from "react"

const BlogForm = ({ createBlog, setErrorMessage }) => {
    const [newBlog, setNewBlog] = useState({
        title: '',
        author: '',
        url: ''
    })

    const addBlog = async (event) => {
        event.preventDefault()
        try {
            const createdBlog = await createBlog(newBlog)
            setNewBlog({ title: '', author: '', url: '' })
            setErrorMessage(`a new blog "${createdBlog.title}" by "${createdBlog.author}" added`)
            setTimeout(() => setErrorMessage(null), 4000)

            
        } catch (error) {
            setErrorMessage('Error: failed to add blog')
            setTimeout(() => setErrorMessage(null), 4000)
        }
    }

    const handleBlogChange = (event) => {
        const { name, value } = event.target
        setNewBlog({ ...newBlog, [name]: value })
    }

    return (
        <div>
            <h2>Create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    <label>Title</label>
                    <input name="title" value={newBlog.title} onChange={handleBlogChange} />
                </div>
                <div>
                    <label>Author</label>
                    <input name="author" value={newBlog.author} onChange={handleBlogChange} />
                </div>
                <div>
                    <label>URL</label>
                    <input name="url" value={newBlog.url} onChange={handleBlogChange} />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default BlogForm
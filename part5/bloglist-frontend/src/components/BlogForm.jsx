import React from "react"

const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => (
    <><h1>create new</h1><form onSubmit={addBlog}>
        <div>
            <label htmlFor="title">Title</label>
            <input
                id="title"
                name="title"
                value={newBlog.title}
                onChange={handleBlogChange} />
        </div>
        <div>
            <label htmlFor="author">Author</label>
            <input
                id="author"
                name="author"
                value={newBlog.author}
                onChange={handleBlogChange} />
        </div>
        <div>
            <label htmlFor="url">URL</label>
            <input
                id="url"
                name="url"
                value={newBlog.url}
                onChange={handleBlogChange} />
        </div>
        <button type="submit">create</button>
    </form></>
)

export default BlogForm
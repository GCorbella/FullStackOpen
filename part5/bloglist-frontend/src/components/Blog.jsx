import { useState } from 'react'

const Blog = ({ blog, handleLike, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showDeleteButton = blog.user.username === user.username

  const confirmAndDelete = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className='hiddenBlog'>
        <p>{blog.title} by {blog.author}<button onClick={toggleVisibility}>view</button></p>
      </div>
      <div style={showWhenVisible} className='visibleBlog'>
        <p>{blog.title} by {blog.author}<button onClick={toggleVisibility}>hide</button></p>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
        <p>{blog.user?.name}</p>
        {showDeleteButton && (
          <p>
            <button onClick={confirmAndDelete}>remove</button>
          </p>
        )}
      </div>
    </div>

  )
}

export default Blog
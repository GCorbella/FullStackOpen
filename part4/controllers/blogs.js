const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({
            error: 'blog not found'
        })
    }

    if (blog.user.toString() !== request.user.id.toString()) {
        return response.status(401).json({
            error: 'this blog does not belong to you'
        })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor, async (request, response, next) => {
    const body = request.body
    const user = request.user

    if (!body.title) {
        return response.status(400).json({
            error: 'title missing'
        })
    }

    if (!body.author) {
        return response.status(400).json({
            error: 'author missing'
        })
    }

    if (!body.url) {
        return response.status(400).json({
            error: 'url missing'
        })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response, next) => {
    const { title, author, url, likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true, context: 'query' }
    )
    if (updatedBlog) {
        response.status(200).json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

module.exports = blogsRouter
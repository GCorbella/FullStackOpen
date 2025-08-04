const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0,
        user: "5f50c31b5c6e3c1a3c3d8c1b"
    }
]

const initialUsers = [
    {
        _id: '5f50c31b5c6e3c1a3c3d8c1a',
        username: 'testuser1',
        name: 'Test User One',
        passwordHash: bcrypt.hashSync('pass123', 10),
        blogs: [],
        __v: 0
    },
    {
        _id: '5f50c31b5c6e3c1a3c3d8c1b',
        username: 'testuser2',
        name: 'Test User Two',
        passwordHash: bcrypt.hashSync('pass456', 10),
        blogs: [],
        __v: 0
    }
]

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'willremovethissoon',
        author: "Test Mc Testy",
        url: "http://www.blogtesting.tu"
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    usersInDb,
    initialBlogs,
    initialUsers,
    nonExistingId,
    blogsInDb
}
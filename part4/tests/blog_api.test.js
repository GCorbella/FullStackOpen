const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const config = require('../utils/config');
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

console.log('Testing database:', config.MONGODB_URI);

let authToken

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const userObjects = helper.initialUsers.map(user => new User(user))
  const savedUsers = await User.insertMany(userObjects)

  const userId = savedUsers[0]._id

  const blogObjects = helper.initialBlogs.map((blog, index) => {
    if (index === 0) {
      return new Blog({ ...blog, user: userId })
    } else {
      return new Blog(blog)
    }
  })

  const savedBlogs = await Blog.insertMany(blogObjects)

  savedUsers[0].blogs = savedBlogs.map(b => b._id)
  await savedUsers[0].save()


  const loginResponse = await api
    .post('/api/login')
    .send({
      username: helper.initialUsers[0].username,
      password: 'pass123'
    })

  authToken = loginResponse.body.token
})

describe('returning blogs', () => {
  test('all blogs are returned as and are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]
    assert.ok(blog.id)
  })
})

describe('adding blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "Test Blog",
      author: "William Griffin",
      url: "testblog.tv",
      likes: 2
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    assert(titles.includes('Test Blog'))
  })

  test('a valid blog without likes will have 0 likes', async () => {
    const newBlog = {
      title: "Test Blog",
      author: "William Griffin",
      url: "testblog.tv",
      userId: "6888f8842c326d594c7dfbc3"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const testBlog = blogsAtEnd.find(blog => blog.title === 'Test Blog')
    assert.strictEqual(testBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: "William Griffin",
      url: "testblog.tv",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: "Test Blog",
      author: "William Griffin",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('a valid blog without token cannot be added ', async () => {
    const newBlog = {
      title: "Test Blog",
      author: "William Griffin",
      url: "testblog.tv",
      likes: 2
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const titles = blogsAtEnd.map(n => n.title)
    assert(!titles.includes('Test Blog'))
  })
})

describe('deleting blogs', () => {
  test('deleting a blog by id', async () => {
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes('5a422a851b54a676234d17f7'))
  })

  test('deleting a blog by id that does not belong to you', async () => {

    const result = await api
      .delete('/api/blogs/5a422aa71b54a676234d17f8')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert(result.body.error.includes('this blog does not belong to you'))
  })
})

describe('modifying blogs', () => {
  test('modifying likes', async () => {
    const newLikes = {
      likes: 800
    }

    await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send(newLikes)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd.find(b => b.id === '5a422a851b54a676234d17f7')
    assert.strictEqual(updatedBlog.likes, 800)
  })
})

after(async () => {
  await mongoose.connection.close()
})
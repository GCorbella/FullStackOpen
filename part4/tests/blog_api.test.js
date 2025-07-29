const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const config = require('../utils/config');
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

console.log('Testing database:', config.MONGODB_URI);

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
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

    await api
      .post('/api/blogs')
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
      url: "testblog.tv"
    }

    await api
      .post('/api/blogs')
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
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

describe('deleting blogs', () => {
  test('deleting a blog by id', async () => {
    await api
      .delete('/api/blogs/5a422a851b54a676234d17f7')
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes('5a422a851b54a676234d17f7'))
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
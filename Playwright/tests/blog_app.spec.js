const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNewBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Test User One',
                username: 'testuser1',
                password: 'pass123'
            }
        })
        await request.post('/api/users', {
            data: {
                name: 'Test User Two',
                username: 'testuser2',
                password: 'pass456'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        const locator = await page.getByText('username')
        await expect(locator).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'testuser1', 'pass123')
            await expect(page.getByText('Test User One logged-in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'testuser3', 'pass123')
            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'testuser2', 'pass456')
            await createNewBlog(page, 'testuser2isbetter', 'test author', 'test url')
            await page.getByRole('button', { name: 'log out' }).click()
            await loginWith(page, 'testuser1', 'pass123')
        })
        test('a new blog can be created', async ({ page }) => {
            await createNewBlog(page, 'test title', 'test author', 'test url')

            const blog = page.locator('.blog', { hasText: `test title by test author` })
            await expect(blog).toBeVisible()
        })

        test('a blog can be edited', async ({ page }) => {
            await createNewBlog(page, 'test title', 'test author', 'test url')
            const blog = page.locator('.blog', { hasText: `test title by test author` })

            await blog.getByRole('button', { name: 'view' }).click()
            await blog.getByRole('button', { name: 'like' }).click()

            await expect(blog.getByTestId('likeCounter')).toContainText('1 like')
        })

        test('a blog can be deleted', async ({ page }) => {
            await createNewBlog(page, 'test title', 'test author', 'test url')
            const blog = page.locator('.blog', { hasText: `test title by test author` })

            await blog.getByRole('button', { name: 'view' }).click()

            page.once('dialog', async (dialog) => {
                expect(dialog.message()).toContain('Remove blog')
                await dialog.accept()
            })

            await blog.getByRole('button', { name: 'remove' }).click()

            await expect(blog).toHaveCount(0)
        })

        test('the delete button of a blog can only be seen by its creator', async ({ page }) => {
            const blog = page.locator('.blog', { hasText: `testuser2isbetter by test author` })
            await blog.getByRole('button', { name: 'view' }).click()

            await expect(blog.getByTestId('deleteButton')).not.toBeVisible()

            await page.getByRole('button', { name: 'log out' }).click()
            await loginWith(page, 'testuser2', 'pass456')

            const blogAfterLogin = page.locator('.blog', { hasText: `testuser2isbetter by test author` })
            await blogAfterLogin.getByRole('button', { name: 'view' }).click()

            await expect(blogAfterLogin.getByTestId('deleteButton')).toBeVisible()

        })

        test('the blog with most likes is shown first', async ({ page }) => {
            await createNewBlog(page, 'second blog', 'second author', 'url2')

            const secondBlog = page.locator('.blog', { hasText: 'second blog by second author' })

            await secondBlog.getByRole('button', { name: 'view' }).click()
            await secondBlog.getByRole('button', { name: 'like' }).click()
            await secondBlog.getByRole('button', { name: 'like' }).click()
            await secondBlog.getByRole('button', { name: 'like' }).click()

            const allBlogs = await page.locator('.blog').allInnerTexts()

            expect(allBlogs[0]).toContain('second blog by second author')
        })
    })
})
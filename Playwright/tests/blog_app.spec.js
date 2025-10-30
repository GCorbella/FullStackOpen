const { test, describe, expect, beforeEach } = require('@playwright/test')
const {loginWith} = require('./helper')

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
})
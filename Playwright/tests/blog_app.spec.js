const { test, describe, expect } = require('@playwright/test')
const { beforeEach } = require('node:test')

describe('Blog app', () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({ page }) => {
        await page.goto('http://localhost:5173')

        const locator = await page.getByText('username')
        await expect(locator).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.goto('http://localhost:5173')

            await page.getByTestId('username').fill('testuser1')
            await page.getByTestId('password').fill('pass123')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Test User One logged-in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.goto('http://localhost:5173')

            await page.getByTestId('username').fill('testuser3')
            await page.getByTestId('password').fill('pass123')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Wrong username or password')).toBeVisible()
        })
    })
})
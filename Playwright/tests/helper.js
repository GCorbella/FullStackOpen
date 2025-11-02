const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNewBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByTestId('insTitle').fill(title)
  await page.getByTestId('insAuthor').fill(author)
  await page.getByTestId('insUrl').fill(url)
  await page.getByRole('button', { name: 'Create' }).click()
}

export { loginWith, createNewBlog }
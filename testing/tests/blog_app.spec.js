const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')

    // Create a user
    const newUser = {
      username: 'Alice',
      name: 'Alice Luke',
      password: 'passw0rd123'
    }

    await request.post('/api/users', { data: newUser })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('Log in to application')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('Alice')
      await page.getByTestId('password').fill('passw0rd123')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Alice Luke logged in')).toBeVisible()
      await expect(page.getByText('logout')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Alice', 'wrongpass')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Alice Luke logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Alice', 'passw0rd123')
            await expect(page.getByText('Alice Luke logged in')).toBeVisible()
        })
      
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'End to End Testing with Playwright', 'Henry Hart', 'https://www.playwright.com')
            await expect(page.getByText('End to End Testing with Playwright Henry Hart')).toBeVisible()
            await expect(page.getByText('view')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'End to End Testing with Playwright', 'Henry Hart', 'https://www.playwright.com')
            await expect(page.getByText('End to End Testing with Playwright Henry Hart')).toBeVisible()
            await expect(page.getByText('view')).toBeVisible()
            
            // Locate the blog element
            const blogElement = await page.getByText('End to End Testing with Playwright Henry Hart').locator('..')
    
            // Click the view button to reveal the like button
            await blogElement.getByRole('button', { name: 'view' }).click()
    
            // Click the like button
            await blogElement.getByRole('button', { name: 'like' }).click()
    
            // Verify that the like count has increased
            await expect(blogElement.getByText('likes 1')).toBeVisible()
        }) 
        
        test('a blog can be deleted by the creator', async ({ page }) => {
          await createBlog(page, 'Delete this blog', 'Henry Hart', 'https://www.deleteblog.com')

          await expect(page.getByText('view')).toBeVisible()
          await expect(page.getByText('Delete this blog')).toBeVisible()

          page.on('dialog', async dialog => {
            await dialog.accept()
          })

          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'remove' }).click()

          await expect(page.getByText('Delete this blog')).not.toBeVisible()
        }) 

        test('the delete button is visible to only the user', async ({ page }) => {
          await createBlog(page, 'End to End Testing with playwright', 'Henry Hart', 'https://www.playwright.com')
          await expect(page.getByText('view')).toBeVisible()
          await expect(page.getByText('End to End Testing with playwright')).toBeVisible()

          await page.getByRole('button', { name: 'logout' }).click()
          await expect(page.getByRole('button', { name: 'login' })).toBeVisible()

          await loginWith(page, 'AnotherAlice', 'passw0rd')
          await expect(page.getByText('AnotherAlice Luke logged in')).toBeVisible()
          await expect(page.getByText('view')).toBeVisible()
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByText('remove')).not.toBeVisible()
        })

        test('blogs are ordered according to likes', async ({ page }) => {
          await createBlog(page, 'End to End Testing with playwright', 'Henry Hart', 'https://www.playwright.com')
          await expect(page.locator('text=End to End Testing with playwright')).toBeVisible()

          await createBlog(page, 'Component Testing and its features', 'James Hart', 'https://www.testing.com')
          await expect(page.locator('text=Component Testing and its features')).toBeVisible()

          await page.click(text='view', { nth: 0 })
          await page.click(text='like')
          await page.click(text='like')
          await expect(page.getByText('likes 2')).toBeVisible()

          await page.click(text='view', { nth: 1 })
          await page.click(text='like')
          await page.click(text='like')
          await page.click(text='like')
          await page.click(text='like')
          await expect(page.getByText('likes 4')).toBeVisible()
          
          const blogs = await page.locator('.blog').allTextContents()
          expect(blogs).toHaveLength(2)
          expect(blogs[0]).toContain('Component Testing and its features')
          expect(blogs[1]).toContain('End to End Testing with playwright')
        })
    })
  })
})
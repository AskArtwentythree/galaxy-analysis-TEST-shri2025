import { test, expect } from '@playwright/test';

test.describe('Навигация', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('должна отображать все ссылки навигации', async ({ page }) => {
        await expect(page.getByText(/CSV Аналитик/i)).toBeVisible();
        await expect(page.getByText(/CSV Генератор/i)).toBeVisible();
        await expect(page.getByText(/История/i)).toBeVisible();
    });

    test('должна переходить на страницу генерации', async ({ page }) => {
        await page.getByText(/CSV Генератор/i).click();
        await expect(page.getByText(/Начать генерацию/i)).toBeVisible();
    });

    test('должна переходить на страницу истории', async ({ page }) => {
        await page.getByText(/История/i).click();
        await expect(page.getByText(/Сгенерировать больше/i)).toBeVisible();
    });
});

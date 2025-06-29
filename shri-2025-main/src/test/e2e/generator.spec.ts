import { test, expect } from '@playwright/test';

test.describe('Страница генератора', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/generate');
    });

    test('должна отображать кнопку генерации', async ({ page }) => {
        await expect(page.getByText(/Начать генерацию/i)).toBeVisible();
    });

    test('должна обрабатывать клик по кнопке генерации', async ({ page }) => {
        await page.getByRole('button', { name: /Начать генерацию/i }).click();

        await expect(page.getByRole('button', { name: /Начать генерацию/i })).toBeVisible();
    });
});

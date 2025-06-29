import { test, expect } from '@playwright/test';

test.describe('Страница истории', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/history');
    });

    test('должна отображать кнопку генерации', async ({ page }) => {
        await expect(page.getByText(/Сгенерировать больше/i)).toBeVisible();
    });

    test('должна переходить на страницу генерации при клике на кнопку "Сгенерировать больше"', async ({ page }) => {
        await page.getByText(/Сгенерировать больше/i).click();
        await expect(page.getByText(/Начать генерацию/i)).toBeVisible();
    });
});

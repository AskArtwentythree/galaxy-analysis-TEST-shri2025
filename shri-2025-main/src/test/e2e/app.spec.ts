import { test, expect } from '@playwright/test';

test.describe('Полный поток приложения', () => {
    test('должен отображать главную страницу', async ({ page }) => {
        await page.goto('/');

        await expect(page.getByTestId('dropzone')).toBeVisible();
    });

    test('должен переходить между страницами', async ({ page }) => {
        await page.goto('/');

        await page.getByText(/CSV Генератор/i).click();
        await expect(page.getByText(/Начать генерацию/i)).toBeVisible();

        await page.getByText(/История/i).click();
        await expect(page.getByText(/Сгенерировать больше/i)).toBeVisible();

        await page.getByText(/CSV Аналитик/i).click();
        await expect(page.getByTestId('dropzone')).toBeVisible();
    });
});

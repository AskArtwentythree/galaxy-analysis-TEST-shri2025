import { test, expect } from '@playwright/test';

test.describe('Страница аналитики', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('должна отображать секцию загрузки файла', async ({ page }) => {
        await expect(page.getByTestId('dropzone')).toBeVisible();
    });

    test('должна обрабатывать загрузку файла', async ({ page }) => {
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles('src/test/reports/report_correct.csv');

        await expect(page.getByText('report_correct.csv')).toBeVisible();
    });
});

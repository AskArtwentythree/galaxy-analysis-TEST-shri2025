import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@test/utils/test-utils';
import { HomePage } from '@pages/Home';
import fs from 'fs';
import path from 'path';

describe('Главная страница', () => {
    let validFile: File;
    let invalidFile: File;

    beforeAll(() => {
        const validCsvPath = path.resolve(__dirname, '../../reports/valid.csv');
        const validCsvContent = fs.readFileSync(validCsvPath, 'utf-8');
        validFile = new File([validCsvContent], 'valid.csv', { type: 'text/csv' });

        const invalidCsvPath = path.resolve(__dirname, '../../reports/invalid.csv');
        const invalidCsvContent = fs.readFileSync(invalidCsvPath, 'utf-8');
        invalidFile = new File([invalidCsvContent], 'invalid.csv', { type: 'text/csv' });
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('отображает начальное состояние с сообщением о загрузке', () => {
        render(<HomePage />);

        const titleElements = screen.getAllByText((content, element) => {
            return element?.textContent?.includes('Загрузите csv файл') || false;
        });
        expect(titleElements[0]).toBeInTheDocument();

        const infoElements = screen.getAllByText((content, element) => {
            return element?.textContent?.includes('получите полную информацию') || false;
        });
        expect(infoElements[0]).toBeInTheDocument();
    });

    it('отображает имя выбранного файла после выбора', async () => {
        const user = userEvent.setup();
        render(<HomePage />);

        const fileInput = screen.getByTestId('file-input');
        await user.upload(fileInput, validFile);

        expect(screen.getByText('valid.csv')).toBeInTheDocument();
    });

    it('очищает выбранный файл и сбрасывает состояние', async () => {
        const user = userEvent.setup();
        render(<HomePage />);

        const fileInput = screen.getByTestId('file-input');
        await user.upload(fileInput, validFile);
        expect(screen.getByText('valid.csv')).toBeInTheDocument();

        const clearButton = screen.getByTestId('clear-file-button');
        await user.click(clearButton);
        expect(screen.queryByText('valid.csv')).not.toBeInTheDocument();
    });
});

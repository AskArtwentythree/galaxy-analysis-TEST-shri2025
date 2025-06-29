import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { render } from '@test/utils/test-utils';
import { GeneratePage } from '@pages/Generate';

describe('Страница генерации отчёта', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('отображает начальное состояние с кнопкой генерации', () => {
        render(<GeneratePage />);

        expect(screen.getByText('Начать генерацию')).toBeInTheDocument();
    });

    it('отображает сообщение об успехе после генерации', async () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            blob: () => Promise.resolve(new Blob(['test'])),
            headers: { get: () => undefined },
        });

        render(<GeneratePage />);

        const generateButton = screen.getByText('Начать генерацию');

        await act(async () => {
            generateButton.click();
        });

        await waitFor(() => {
            expect(screen.getByText('Отчёт успешно сгенерирован!')).toBeInTheDocument();
        });
    });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCsvAnalysis } from '@hooks/use-csv-analysis';

vi.mock('@utils/analysis', () => ({
    transformAnalysisData: vi.fn().mockReturnValue({
        highlights: { total_spend_galactic: 1000 },
        highlightsToStore: [{ title: '1000', description: 'Общие расходы' }],
    }),
    InvalidServerResponseError: class InvalidServerResponseError extends Error {
        constructor(message: string) {
            super(message);
            this.name = 'InvalidServerResponseError';
        }
    },
}));

describe('Хук useCsvAnalysis', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('успешно анализирует CSV файл', async () => {
        const mockOnData = vi.fn();
        const mockOnComplete = vi.fn();
        const mockOnError = vi.fn();

        const mockResponse = {
            ok: true,
            body: {
                getReader: vi.fn().mockReturnValue({
                    read: vi
                        .fn()
                        .mockResolvedValueOnce({
                            done: false,
                            value: new TextEncoder().encode('test data'),
                        })
                        .mockResolvedValueOnce({
                            done: true,
                            value: undefined,
                        }),
                }),
            },
        };

        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onComplete: mockOnComplete,
                onError: mockOnError,
            })
        );

        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

        await act(async () => {
            await result.current.analyzeCsv(file);
        });

        expect(mockOnData).toHaveBeenCalled();
        expect(mockOnComplete).toHaveBeenCalled();
        expect(mockOnError).not.toHaveBeenCalled();
    });

    it('обрабатывает ошибку сервера', async () => {
        const mockOnData = vi.fn();
        const mockOnComplete = vi.fn();
        const mockOnError = vi.fn();

        const mockResponse = {
            ok: false,
            body: null,
        };

        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onComplete: mockOnComplete,
                onError: mockOnError,
            })
        );

        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

        await act(async () => {
            await result.current.analyzeCsv(file);
        });

        expect(mockOnError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Неизвестная ошибка парсинга :(',
            })
        );
        expect(mockOnData).not.toHaveBeenCalled();
        expect(mockOnComplete).not.toHaveBeenCalled();
    });

    it('обрабатывает пустое тело ответа', async () => {
        const mockOnData = vi.fn();
        const mockOnComplete = vi.fn();
        const mockOnError = vi.fn();

        const mockResponse = {
            ok: true,
            body: null,
        };

        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onComplete: mockOnComplete,
                onError: mockOnError,
            })
        );

        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

        await act(async () => {
            await result.current.analyzeCsv(file);
        });

        expect(mockOnError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Неизвестная ошибка парсинга :(',
            })
        );
        expect(mockOnData).not.toHaveBeenCalled();
        expect(mockOnComplete).not.toHaveBeenCalled();
    });

    it('обрабатывает сетевую ошибку', async () => {
        const mockOnData = vi.fn();
        const mockOnComplete = vi.fn();
        const mockOnError = vi.fn();

        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() =>
            useCsvAnalysis({
                onData: mockOnData,
                onComplete: mockOnComplete,
                onError: mockOnError,
            })
        );

        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

        await act(async () => {
            await result.current.analyzeCsv(file);
        });

        expect(mockOnError).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Неизвестная ошибка парсинга :(',
            })
        );
        expect(mockOnData).not.toHaveBeenCalled();
        expect(mockOnComplete).not.toHaveBeenCalled();
    });
});

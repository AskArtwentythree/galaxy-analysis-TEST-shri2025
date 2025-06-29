import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getHistory, addToHistory, removeFromHistory, clearHistory } from '@utils/storage';

describe('Утилиты хранилища', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe('getHistory', () => {
        it('возвращает пустой массив для пустой истории', () => {
            const result = getHistory();
            expect(result).toEqual([]);
        });

        it('возвращает сохраненную историю', () => {
            const mockHistory = [
                { id: '1', fileName: 'test1.csv', timestamp: Date.now() },
                { id: '2', fileName: 'test2.csv', timestamp: Date.now() },
            ];
            localStorage.setItem('tableHistory', JSON.stringify(mockHistory));

            const result = getHistory();
            expect(result).toEqual(mockHistory);
        });

        it('возвращает пустой массив при некорректных данных', () => {
            localStorage.setItem('tableHistory', 'invalid-json');

            const result = getHistory();
            expect(result).toEqual([]);
        });
    });

    describe('addToHistory', () => {
        it('добавляет новый элемент в историю', () => {
            const newItem = { fileName: 'new.csv' };
            const result = addToHistory(newItem);

            expect(result).toMatchObject({
                id: 'test-uuid',
                fileName: 'new.csv',
                timestamp: expect.any(Number),
            });

            const savedHistory = getHistory();
            expect(savedHistory).toHaveLength(1);
            expect(savedHistory[0]).toEqual(result);
        });

        it('добавляет элемент в пустую историю', () => {
            const newItem = { fileName: 'first.csv' };
            const result = addToHistory(newItem);

            expect(result.id).toBe('test-uuid');
            expect(result.fileName).toBe('first.csv');
            expect(result.timestamp).toBeGreaterThan(0);

            const savedHistory = getHistory();
            expect(savedHistory).toHaveLength(1);
        });
    });

    describe('removeFromHistory', () => {
        it('удаляет элемент по ID', () => {
            const mockHistory = [
                { id: '1', fileName: 'test1.csv', timestamp: Date.now() },
                { id: '2', fileName: 'test2.csv', timestamp: Date.now() },
            ];
            localStorage.setItem('tableHistory', JSON.stringify(mockHistory));

            removeFromHistory('1');

            const result = getHistory();
            expect(result).toHaveLength(1);
            expect(result[0].id).toBe('2');
        });
    });

    describe('clearHistory', () => {
        it('очищает всю историю', () => {
            const mockHistory = [
                { id: '1', fileName: 'test1.csv', timestamp: Date.now() },
                { id: '2', fileName: 'test2.csv', timestamp: Date.now() },
            ];
            localStorage.setItem('tableHistory', JSON.stringify(mockHistory));

            clearHistory();

            const result = getHistory();
            expect(result).toEqual([]);
        });
    });
});

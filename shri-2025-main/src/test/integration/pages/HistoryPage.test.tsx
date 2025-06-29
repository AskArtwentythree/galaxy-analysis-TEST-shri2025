import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@test/utils/test-utils';
import { HistoryPage } from '@pages/History';
import { HistoryItemType } from '@app-types/history';
import { Highlights } from '@app-types/common';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockHistoryStore = {
    history: [] as HistoryItemType[],
    showModal: vi.fn(),
    hideModal: vi.fn(),
    setSelectedItem: vi.fn(),
    removeFromHistory: vi.fn(),
    removeFromHistoryStore: vi.fn(),
    clearHistory: vi.fn(),
    updateHistoryFromStorage: vi.fn(),
    isModalOpen: false,
    selectedItem: null as HistoryItemType | null,
};

vi.mock('@store/historyStore', () => ({
    useHistoryStore: () => mockHistoryStore,
}));

const mockHighlights: Highlights = {
    total_spend_galactic: 1000,
    rows_affected: 100,
    less_spent_at: 1,
    big_spent_at: 365,
    less_spent_value: 10,
    big_spent_value: 500,
    average_spend_galactic: 50,
    big_spent_civ: 'Test Civ',
    less_spent_civ: 'Other Civ',
};

describe('Страница истории', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockHistoryStore.history = [];
        mockHistoryStore.isModalOpen = false;
        mockHistoryStore.selectedItem = null;
    });

    it('отображает пустое состояние истории', () => {
        render(<HistoryPage />);

        expect(screen.getByText(/Сгенерировать больше/i)).toBeInTheDocument();
        expect(screen.queryByText(/Очистить всё/i)).not.toBeInTheDocument();
    });

    it('отображает элементы истории', () => {
        const mockItems: HistoryItemType[] = [
            {
                id: '1',
                fileName: 'test1.csv',
                timestamp: Date.now(),
                highlights: mockHighlights,
            },
            {
                id: '2',
                fileName: 'test2.csv',
                timestamp: Date.now(),
            },
        ];

        mockHistoryStore.history = mockItems;

        render(<HistoryPage />);

        expect(screen.getByText('test1.csv')).toBeInTheDocument();
        expect(screen.getByText('test2.csv')).toBeInTheDocument();
        expect(screen.getByText(/Очистить всё/i)).toBeInTheDocument();
    });

    it('открывает модальное окно при клике на успешный элемент истории', async () => {
        const user = userEvent.setup();
        const mockItem: HistoryItemType = {
            id: '1',
            fileName: 'test.csv',
            timestamp: Date.now(),
            highlights: mockHighlights,
        };

        mockHistoryStore.history = [mockItem];

        render(<HistoryPage />);

        const historyItem = screen.getByText('test.csv');
        await user.click(historyItem);

        expect(mockHistoryStore.setSelectedItem).toHaveBeenCalledWith(mockItem);
        expect(mockHistoryStore.showModal).toHaveBeenCalled();
    });

    it('не открывает модальное окно для неуспешных элементов истории', async () => {
        const user = userEvent.setup();
        const mockItem: HistoryItemType = {
            id: '1',
            fileName: 'test.csv',
            timestamp: Date.now(),
        };

        mockHistoryStore.history = [mockItem];

        render(<HistoryPage />);

        const historyItem = screen.getByText('test.csv');
        await user.click(historyItem);

        expect(mockHistoryStore.setSelectedItem).not.toHaveBeenCalled();
        expect(mockHistoryStore.showModal).not.toHaveBeenCalled();
    });

    it('очищает всю историю при клике на кнопку очистки', async () => {
        const user = userEvent.setup();
        const mockItems: HistoryItemType[] = [
            {
                id: '1',
                fileName: 'test1.csv',
                timestamp: Date.now(),
            },
            {
                id: '2',
                fileName: 'test2.csv',
                timestamp: Date.now(),
            },
        ];

        mockHistoryStore.history = mockItems;

        render(<HistoryPage />);

        const clearButton = screen.getByText(/Очистить всё/i);
        await user.click(clearButton);

        expect(mockHistoryStore.clearHistory).toHaveBeenCalled();
    });

    it('переходит на страницу генерации при клике на кнопку "Сгенерировать больше"', async () => {
        const user = userEvent.setup();

        render(<HistoryPage />);

        const generateButton = screen.getByText(/Сгенерировать больше/i);
        await user.click(generateButton);

        expect(mockNavigate).toHaveBeenCalledWith('/generate');
    });

    it('закрывает модальное окно при клике на кнопку закрытия', async () => {
        const user = userEvent.setup();

        mockHistoryStore.isModalOpen = true;
        mockHistoryStore.selectedItem = {
            id: '1',
            fileName: 'test.csv',
            timestamp: Date.now(),
            highlights: mockHighlights,
        };

        render(<HistoryPage />);

        const closeButton = screen.getByTestId('close-modal');
        await user.click(closeButton);

        expect(mockHistoryStore.hideModal).toHaveBeenCalled();
    });
});

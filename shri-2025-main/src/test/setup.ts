import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

Object.defineProperty(window, 'URL', {
    value: URL,
    writable: true,
});

Object.defineProperty(window, 'crypto', {
    value: {
        randomUUID: () => 'test-uuid',
        getRandomValues: (arr: any) => {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = Math.floor(Math.random() * 256);
            }
            return arr;
        },
    },
    writable: true,
});

Object.defineProperty(window.URL, 'createObjectURL', {
    value: vi.fn(() => 'blob:test-url'),
    writable: true,
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
    value: vi.fn(),
    writable: true,
});

Object.defineProperty(window, 'location', {
    value: {
        href: 'http://localhost:3000/',
        origin: 'http://localhost:3000',
        pathname: '/',
        search: '',
        hash: '',
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
    },
    writable: true,
});

Object.defineProperty(window, 'navigation', {
    value: {
        navigate: vi.fn(),
        reload: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        canGoBack: false,
        canGoForward: false,
        currentEntry: {
            index: 0,
            key: 'test-key',
            id: 'test-id',
            url: 'http://localhost:3000',
            getState: vi.fn(),
        },
        entries: () => [],
        updateCurrentEntry: vi.fn(),
        traverseTo: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    },
    writable: true,
});

const originalCreateElement = document.createElement;
document.createElement = vi.fn((tagName: string) => {
    if (tagName === 'a') {
        const element = originalCreateElement.call(document, tagName);
        element.click = vi.fn();
        element.setAttribute = vi.fn();
        Object.defineProperty(element, 'style', {
            value: {} as CSSStyleDeclaration,
            writable: true,
        });
        return element;
    }
    return originalCreateElement.call(document, tagName);
});

global.fetch = vi.fn();

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};

let storage: { [key: string]: string } = {};

Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: (key: string) => storage[key] || null,
        setItem: (key: string, value: string) => {
            storage[key] = value;
        },
        removeItem: (key: string) => {
            delete storage[key];
        },
        clear: () => {
            storage = {};
        },
    },
    writable: true,
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

const originalError = console.error;
console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
        return;
    }
    if (typeof args[0] === 'string' && args[0].includes('Not implemented: navigation')) {
        return;
    }
    if (typeof args[0] === 'string' && args[0].includes('No window.location.(origin|href) available')) {
        return;
    }
    originalError.call(console, ...args);
};

const originalWarn = console.warn;
console.warn = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning')) {
        return;
    }
    originalWarn.call(console, ...args);
};

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    storage = {};
});

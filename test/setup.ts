import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock fetch
global.fetch = vi.fn()

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Mock Nuxt composables
vi.mock('#app', () => ({
    useRuntimeConfig: () => ({
        public: {
            backend: 'http://localhost:3001'
        }
    }),
    useFetch: vi.fn(),
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn()
    }),
    useRoute: () => ({
        params: {},
        query: {},
        path: '/'
    })
}))

// Mock Nuxt components
vi.mock('#components', () => ({
    Icon: {
        name: 'Icon',
        props: ['name', 'size'],
        template: '<span class="icon"></span>'
    }
})) 
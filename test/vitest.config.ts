import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'test/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/coverage/**',
                '**/dist/**',
                '**/.nuxt/**',
                '**/.output/**'
            ]
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('../client', import.meta.url)),
            '~': fileURLToPath(new URL('../client', import.meta.url)),
            'client': fileURLToPath(new URL('../client', import.meta.url)),
            'server': fileURLToPath(new URL('../server', import.meta.url))
        }
    }
}) 
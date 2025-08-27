import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import {defineConfig} from 'vitest/config'
import {fileURLToPath} from "node:url";

export default defineConfig({
    base: '/',
    plugins: [vue(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['tests/setup.ts'],
    },
})

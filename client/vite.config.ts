import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';
// import terminal from 'vite-plugin-terminal';

// https://vitejs.dev/config/
export default defineConfig({
    mode: process.env.NODE_ENV || 'development',
    plugins: [
        react(),
        process.env.NODE_ENV === 'production' ? checker({
            typescript: true,
            eslint: {
                lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
            }
        }) : null,
        // terminal({
        //     console: 'terminal',
        //     output: ['terminal', 'console'],
        // }),
    ],
    optimizeDeps: {
        include: ['@headlessui/react'],
    },
    server: {
        port: 3000,
        host: '0.0.0.0'
    },
    preview: {
        port: 5000,
        headers: {
            'Cache-Control': 'public, max-age=300',
        },
    },
    build: {
        minify: 'terser',
        terserOptions: {
            compress: {
                'drop_console': true,
                'drop_debugger': true
            }
        },
        chunkSizeWarningLimit: 5000,
        outDir: './app/public'
    },
});
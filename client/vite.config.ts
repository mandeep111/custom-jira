import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

export default ({ mode }: { mode: string }) => {
    const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
    return defineConfig({
        plugins: [
            react(),
            process.env.NODE_ENV === 'production' ? checker({
                typescript: true,
                eslint: {
                    lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
                }
            }) : null
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
        define: {
            APP_TITLE: JSON.stringify(env.VITE_APP_TITLE),
            SERVER_URL: JSON.stringify(env.VITE_SERVER_URL),
            WORKFLOW_ENABLED: env.VITE_WORKFLOW_ENABLED,
            WORKFLOW_SERVER_URL: JSON.stringify(env.VITE_WORKFLOW_SERVER_URL),
            SERVER: {
                URL: env.VITE_SERVER_URL,
                API: {
                    AUTHENTICATION: ` ${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_AUTHENTICATION!}`,
                    FOLDER: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_FOLDER!}`,
                    FORM: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_FORM!}`,
                    PROJECT: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_PROJECT!}`,
                    SPACE: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_SPACE!}`,
                    SUBTASK: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_SUBTASK!}`,
                    TASK: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_TASK!}`,
                    TASKSTAGE: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_TASKSTAGE!}`,
                    USER: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_USER!}`,
                    USERPROFILE: `${env.VITE_SERVER_URL!}/${env.VITE_API_VERSION!}/${env.VITE_API_USERPROFILE!}`
                }
            }
        },
    });
};
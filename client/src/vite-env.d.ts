/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: boolean;
    readonly VITE_SERVER_URL: string;
    readonly VITE_WORKFLOW_ENABLED: boolean;
    readonly VITE_WORKFLOW_SERVER_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
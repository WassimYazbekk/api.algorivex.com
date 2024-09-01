/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_VERSION: number;
    readonly VITE_AUTH_TOKEN_NAME: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

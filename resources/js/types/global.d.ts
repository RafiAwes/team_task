import type { Auth } from '@/types/auth';

declare global {
    function route(name: string, params?: any, absolute?: boolean): string;
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}

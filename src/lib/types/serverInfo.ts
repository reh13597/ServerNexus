export interface ServerData {
    online: boolean;
    host: string;
    port: number;
    ip_address: string | null;
    icon: string | null;
    eula_blocked: boolean | null;
    software: string | null;

    version: {
        name_raw: string;
        name_clean: string;
        name_html: string;
        protocol: number;
    };

    players: {
        online: number;
        max: number;
        sample?: Array<{
            name: string;
            id: string;
        }>;
    };

    motd?: {
        raw: string;
        clean: string;
        html: string;
    };

    mods?: Array<{
        name: string;
        version: string;
    }>;

    plugins?: Array<{
        name: string;
        version?: string;
    }>;
}

export interface ServerProfile {
    id: string;
    host: string;
    port: number;
    icon: string | null;
    avg_rating: number;
    review_count: number;
    save_count: number;
}


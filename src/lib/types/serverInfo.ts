export interface ServerData {
    online: boolean;
    host: string;
    port: number;
    ip_address: string | null;
    eula_blocked: boolean | null;

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

    motd: {
        raw: string;
        clean: string;
        html: string;
    };

    icon?: string;

    mods?: Array<{
        name: string;
        version: string;
    }>;

    software?: string;

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
}


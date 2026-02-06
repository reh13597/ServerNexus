export interface ServerData {
    online: boolean;
    host: string;
    port: number;
    ip_address: string | null;
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
    software?: string;
    plugins?: string[];
}

export interface ServerProfile {
    id: string;
    host: string;
    port: number;
    icon: string | null;
}
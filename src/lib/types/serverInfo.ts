export interface ServerData {
    server: {
        name: string;
        ip: string;
        port: number;
    };
    online: boolean;
    players: {
        now: number;
        max: number;
    };
    motd: string;
}
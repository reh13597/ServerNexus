import type { ServerData } from '../types/serverInfo';

interface CachedServerData {
    data: ServerData;
    timestamp: number;
}

function cacheKey(ip: string, port: number | string): string {
    return `server-cache:${ip}:${port}`;
}

export function cacheServerData(ip: string, port: number | string, data: ServerData): void {
    try {
        const entry: CachedServerData = { data, timestamp: Date.now() };
        localStorage.setItem(cacheKey(ip, port), JSON.stringify(entry));
    } catch {
        // localStorage may be full or unavailable; silently ignore
    }
}

export function getCachedServerData(ip: string, port: number | string): CachedServerData | null {
    try {
        const raw = localStorage.getItem(cacheKey(ip, port));
        if (!raw) return null;
        return JSON.parse(raw) as CachedServerData;
    } catch {
        return null;
    }
}

export function formatCacheAge(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

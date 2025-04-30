<script lang="ts">
    import type { ServerData } from '../types/serverInfo';
    import { error } from '../stores/server';

    export let title: string;
    export let data: ServerData;
    export let type: 'info' | 'connection';
    export let customIp: string = '';
    export let customPort: number;
</script>

<div class="card bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="card-title justify-center">{title}</h2>
        <div class="stats stats-vertical shadow">
            {#if type === 'info'}
                <div class="stat">
                    <div class="stat-title">Version</div>
                    <div class="stat-value">{data.server.name}</div>
                    {#if $error}
                        <span class="stat-value text-error">Error</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="stat-title">Status</div>
                    <div class="stat-value">
                        {#if data.online}
                            <span class="text-success">Online</span>
                        {:else}
                            <span class="text-error">Offline</span>
                        {/if}
                    </div>
                </div>
                <div class="stat">
                    <div class="stat-title">Players</div>
                    <div class="stat-value">{data.players.now}/{data.players.max}</div>
                </div>
            {:else}
                <div class="stat">
                    <div class="stat-title">Server IP</div>
                    <div class="stat-value">{customIp || data.server.ip}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Port</div>
                    <div class="stat-value">{customPort || data.server.port}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">MOTD</div>
                    <div class="stat-value text-sm mt-3">{data.motd}</div>
                    {#if $error}
                        <span class="stat-value text-error">Error</span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
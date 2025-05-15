<script lang="ts">
    import type { ServerData } from '../types/serverInfo';
    import { error } from '../stores/server';

    export let title: string;
    export let data: ServerData;
    export let type: 'info' | 'connection' | 'icon';
    export let customIp: string;
</script>

<div class="card w-full bg-base-100 shadow-xl">
    <div class="card-body">
        <h2 class="text-primary card-title justify-center">{title}</h2>
        <div class="stats stats-vertical shadow">
            {#if type === 'info'}
                <div class="stat">
                    <div class="stat-title">Version</div>
                    <div class="stat-value">{data.version.name_clean}</div>
                    {#if $error}
                        <span class="stat-value text-error">Unknown</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="stat-title">Status</div>
                    <div class="stat-value">
                        {#if data.online}
                            <span class="text-success">Online</span>
                        {:else if !data.online}
                            <span class="text-error">Offline</span>
                        {:else}
                            <span class="text-warning">Unknown</span>
                        {/if}
                    </div>
                </div>
                <div class="stat">
                    <div class="stat-title">Players</div>
                    <div class="stat-value">{data.players.online}/{data.players.max}</div>
                </div>
            {:else if type === 'connection'}
                <div class="stat">
                    <div class="stat-title">Host</div>
                    <div class="stat-value">{customIp || data.host}</div>
                </div>
                <div class="stat">
                    <div class="stat-title">Port</div>
                    {#if $error}
                        <div class="stat-value text-error">Unknown</div>
                    {:else}
                        <div class="stat-value">{data.port}</div>
                    {/if}
                </div>
                <div class="stat">
                    <div class="stat-title">IP</div>
                    <div class="stat-value">{data.ip_address}</div>
                    {#if $error}
                        <span class="stat-value text-error">Unknown</span>
                    {/if}
                </div>
            {:else}
                <div class="stat">
                    <div class="stat-title">Icon</div>
                    {#if data.icon}
                        <div class="flex justify-center items-center">
                            <img src={data.icon} alt="Server Icon" class="w-20 h-20 object-contain mt-3">
                        </div>
                    {:else}
                        <span class="stat-value text-error">Unavailable</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="stat-title">MOTD</div>
                    <div class="stat-value text-sm mt-3">{@html data.motd.html}</div>
                    {#if $error}
                        <span class="stat-value text-error">Unavailable</span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
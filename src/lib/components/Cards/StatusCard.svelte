<script lang="ts">
    import type { ServerData } from '../../types/serverInfo';
    import { error } from '../../stores/server';

    export let title: string;
    export let data: ServerData;
    export let type: 'info' | 'connection' | 'icon';
</script>

<div class="card w-full bg-base-100">
    <div class="card-body">
        <h2 class="text-primary card-title justify-center text-2xl">{title}</h2>
        <div class="stats stats-vertical shadow">
            {#if type === 'info'}
                <div class="stat">
                    <div class="text-2xl">Version</div>
                    <div class="text-xl mt-3">{data.version.name_clean}</div>
                    {#if $error}
                        <span class="text-xl mt-3 text-error">Unknown</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-2xl">Status</div>
                    <div class="text-xl mt-3">
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
                    <div class="text-2xl">Players</div>
                    <div class="text-xl mt-3">{data.players.online}/{data.players.max}</div>
                </div>
            {:else if type === 'connection'}
                <div class="stat">
                    <div class="text-2xl">Host</div>
                    <div class="text-xl mt-3">{data.host}</div>
                </div>
                <div class="stat">
                    <div class="text-2xl">Port</div>
                    {#if $error}
                        <div class="text-xl mt-3 text-error">Unknown</div>
                    {:else}
                        <div class="text-xl mt-3">{data.port}</div>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-2xl">IP</div>
                    <div class="text-xl mt-3">{data.ip_address}</div>
                    {#if $error}
                        <span class="text-xl mt-3 text-error">Unknown</span>
                    {/if}
                </div>
            {:else}
                <div class="stat">
                    <div class="text-2xl">Icon</div>
                    {#if data.icon}
                        <div class="flex justify-center items-center">
                            <img src={data.icon} alt="Server Icon" class="w-25 h-25 object-contain mt-3">
                        </div>
                    {:else}
                        <span class="text-xl mt-3 text-error">Unavailable</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-2xl">MOTD</div>
                    <div class="text-xl mt-3">{@html data.motd.html}</div>
                    {#if $error}
                        <span class="text-xl mt-3 text-error">Unavailable</span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
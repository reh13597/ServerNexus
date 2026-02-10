<script lang="ts">
    import type { ServerData } from '../../types/serverInfo';
    import { error } from '../../stores/server';

    export let title: string;
    export let data: ServerData;
    export let type: 'info' | 'connection' | 'icon';
</script>

<div class="card w-full bg-gradient-to-tr from-black to-base-300">
    <div class="card-body">
        <h2 class="text-primary card-title justify-center text-xl sm:text-xl lg:text-2xl select-none underline">{title}</h2>
        <div class="stats stats-vertical shadow">
            {#if type === 'info'}
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">Version</div>
                    <div class="text-xl mt-3 select-none">{data.version.name_clean}</div>
                    {#if $error}
                        <span class="text-xl mt-3 text-error select-none">Unknown</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">Status</div>
                    <div class="text-xl mt-3">
                        {#if data.online}
                            <span class="text-success select-none">Online</span>
                        {:else if !data.online}
                            <span class="text-error select-none">Offline</span>
                        {:else}
                            <span class="text-warning select-none">Unknown</span>
                        {/if}
                    </div>
                </div>
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">Players</div>
                    <div class="text-xl mt-3 select-none">{data.players.online}/{data.players.max}</div>
                </div>

            {:else if type === 'connection'}
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">Host</div>
                    <div class="text-xl mt-3">{data.host}</div>
                </div>
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">Port</div>
                    {#if $error}
                        <div class="text-xl mt-3 text-error select-none">Unknown</div>
                    {:else}
                        <div class="text-xl mt-3">{data.port}</div>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">IP</div>
                    <div class="text-xl mt-3">{data.ip_address}</div>
                    {#if $error}
                        <span class="text-xl mt-3 text-error select-none">Unknown</span>
                    {/if}
                </div>

            {:else}
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">Icon</div>
                    {#if data.icon}
                        <div class="flex justify-center items-center">
                            <img src={data.icon} alt="Server Icon" class="w-25 h-25 object-contain mt-3 select-none">
                        </div>
                    {:else}
                        <span class="text-xl mt-3 text-error select-none">Unavailable</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-xl sm:text-xl lg:text-2xl select-none">MOTD</div>
                    <div class="text-xl mt-3 select-none">{@html data.motd.html}</div>
                    {#if $error}
                        <span class="text-xl mt-3 text-error select-none">Unavailable</span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
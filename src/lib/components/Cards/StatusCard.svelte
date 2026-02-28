<script lang="ts">
    import type { ServerData } from '../../types/serverInfo';
    import { error } from '../../stores/server';

    export let title: string;
    export let data: ServerData;
    export let type: 'info' | 'connection' | 'icon';
</script>

<div class="drop-shadow-xl/80 card card-sm bg-gradient-to-tr from-black to-zinc-800 border-1 border-neutral">
    <div class="card-body">
        <h2 class="text-primary card-title justify-center text-lg lg:text-xl select-none">{title}</h2>
        <div class="stats stats-vertical">
            {#if type === 'info'}
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Version</div>
                    <div class="text-md lg:text-lg mt-3 select-none text-stone-400">{data.version.name_clean}</div>
                    {#if $error}
                        <span class="text-md lg:text-lg mt-3 text-error select-none">Unknown</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Status</div>
                    <div class="text-md lg:text-lg mt-3">
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
                    <div class="text-lg lg:text-xl select-none">Players</div>
                    <div class="text-md lg:text-lg mt-3 select-none text-stone-400">{data.players.online}/{data.players.max}</div>
                </div>

            {:else if type === 'connection'}
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Host</div>
                    <div class="text-md lg:text-lg mt-3 text-stone-400">{data.host}</div>
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Port</div>
                    {#if $error}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Unknown</div>
                    {:else}
                        <div class="text-md lg:text-lg mt-3 text-stone-400">{data.port}</div>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">IP</div>
                    <div class="text-md lg:text-lg mt-3 text-stone-400">{data.ip_address}</div>
                    {#if $error}
                        <span class="text-md lg:text-lg mt-3 text-error select-none">Unknown</span>
                    {/if}
                </div>

            {:else}
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Icon</div>
                    {#if data.icon}
                        <div class="flex justify-center items-center">
                            <img src={data.icon} alt="Server Icon" class="w-10 h-10 md:w-15 md:h-15 object-contain mt-3 select-none">
                        </div>
                    {:else}
                        <span class="text-md lg:text-lg mt-3 text-error select-none">Unavailable</span>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">MOTD</div>
                    <div class="text-md lg:text-lg mt-3 select-none">{@html data.motd.html}</div>
                    {#if $error}
                        <span class="text-md lg:text-lg mt-3 text-error select-none">Unavailable</span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
<script lang="ts">
    import type { ServerData } from '../../types/serverInfo';
    import { error } from '../../stores/server';

    export let title: string;
    export let data: ServerData;
    export let type: 'info' | 'connection' | 'icon';

    let copied: string | number | null = null;

    async function copyToClipboard(text: string | number) {
        await navigator.clipboard.writeText(String(text));
        copied = text;
        setTimeout(() => copied = null, 3000);
    }
</script>

<div class="drop-shadow-xl/80 card card-sm bg-gradient-to-tr from-black to-zinc-700 border-1 border-neutral">
    <div class="card-body">
        <h2 class="text-primary card-title justify-center text-lg lg:text-xl select-none">{title}</h2>
        <div class="stats stats-vertical">
            {#if type === 'info'}
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Status</div>
                    <div class="text-md lg:text-lg mt-3">
                        {#if data.online}
                            <div class="text-success select-none">Online</div>
                        {:else if !data.online && !$error}
                            <div class="text-error select-none">Offline</div>
                        {:else}
                            <div class="text-error select-none">Error</div>
                        {/if}
                    </div>
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Players</div>
                    {#if $error}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Error</div>
                    {:else if !data.online && !$error}
                        <div class="text-md lg:text-lg mt-3 text-stone-400 select-none">Unavailable</div>
                    {:else}
                        <div class="text-md lg:text-lg mt-3 select-none text-stone-400">{data.players.online} / {data.players.max}</div>
                    {/if}
                </div>

                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Version</div>
                    {#if $error}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Error</div>
                    {:else if !data.online && !$error}
                        <div class="text-md lg:text-lg mt-3 text-stone-400 select-none">Unavailable</div>
                    {:else}
                        <div class="text-md lg:text-lg mt-3 select-none text-stone-400">{data.version.name_clean}</div>
                    {/if}
                </div>

            {:else if type === 'connection'}
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Host</div>
                    {#if $error}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Error</div>
                    {:else if !data.online && !$error}
                        <div class="text-md lg:text-lg mt-3 text-stone-400 select-none">Unavailable</div>
                    {:else}
                        <div class="cursor-pointer text-md lg:text-lg mt-3 text-stone-400" on:click={() => copyToClipboard(data.host)}>
                            {data.host}
                            {#if copied === data.host}
                                <i class="text-xs lg:text-sm fa-solid fa-check text-green-500"></i>
                            {:else}
                                <i class="text-xs lg:text-sm fa-regular fa-copy hover:text-primary hover:scale-110 transition duration-200"></i>
                            {/if}
                        </div>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Port</div>
                    {#if $error}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Error</div>
                    {:else if !data.online && !$error}
                        <div class="text-md lg:text-lg mt-3 text-stone-400 select-none">Unavailable</div>
                    {:else}
                        <div class="cursor-pointer text-md lg:text-lg mt-3 text-stone-400" on:click={() => copyToClipboard(data.port)}>
                            {data.port}
                            {#if copied === data.port}
                                <i class="text-xs lg:text-sm fa-solid fa-check text-green-500"></i>
                            {:else}
                                <i class="text-xs lg:text-sm fa-regular fa-copy hover:text-primary hover:scale-110 transition duration-200"></i>
                            {/if}
                        </div>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">IP</div>
                    {#if $error}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Error</div>
                    {:else if !data.online && !$error}
                        <div class="text-md lg:text-lg mt-3 text-stone-400 select-none">Unavailable</div>
                    {:else}
                        <div class="cursor-pointer text-md lg:text-lg mt-3 text-stone-400" on:click={() => copyToClipboard(data.ip_address)}>
                            {data.ip_address}
                            {#if copied === data.ip_address}
                                <i class="text-xs lg:text-sm fa-solid fa-check text-green-500"></i>
                            {:else}
                                <i class="text-xs lg:text-sm fa-regular fa-copy hover:text-primary hover:scale-110 transition duration-200"></i>
                            {/if}
                        </div>
                    {/if}
                </div>

            {:else}
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">Icon</div>
                    {#if data.icon}
                        <div class="flex justify-center items-center">
                            <img src={data.icon} alt="Server Icon" class="w-10 h-10 md:w-15 md:h-15 object-contain mt-3 select-none">
                        </div>
                    {:else if !data.online && !$error}
                        <div class="text-md lg:text-lg mt-3 text-stone-400 select-none">Unavailable</div>
                    {:else}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Error</div>
                    {/if}
                </div>
                <div class="stat">
                    <div class="text-lg lg:text-xl select-none">MOTD</div>
                    {#if $error}
                        <div class="text-md lg:text-lg mt-3 text-error select-none">Error</div>
                    {:else if !data.online && !$error}
                        <div class="text-md lg:text-lg mt-3 text-stone-400 select-none">Unavailable</div>
                    {:else}
                        <div class="text-md lg:text-lg mt-3 select-none">{@html data.motd.html}</div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
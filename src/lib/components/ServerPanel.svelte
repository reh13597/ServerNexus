<script lang="ts">
    import type { ServerData } from '../types/serverInfo';
    import { error } from '../stores/server';

    export let data: ServerData;
</script>

<div class="flex flex-col w-fit lg:flex-row gap-5 lg:gap-10">
    <div class="card bg-gradient-to-tr from-black to-zinc-800 border-1 border-neutral">
        <div class="card-body">
            <div class="stats stats-vertical">
                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-24 text-left">Status</div>
                    <div class="text-lg">
                        {#if data.online}
                            <span class="text-success select-none">Online</span>
                        {:else if !data.online}
                            <span class="text-error select-none">Offline</span>
                        {:else}
                            <span class="text-warning select-none">Unknown</span>
                        {/if}
                    </div>
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-24 text-left">Host</div>
                    <div class="text-lg text-stone-400">{data.host}</div>
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-24 text-left">Port</div>
                    {#if $error}
                        <div class="text-lg text-error select-none">Unknown</div>
                    {:else}
                        <div class="text-lg text-stone-400">{data.port}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-24 text-left">IP</div>
                    <div class="text-lg text-stone-400">{data.ip_address}</div>
                    {#if $error}
                        <span class="text-lg text-error select-none">Unknown</span>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-24 text-left">Players</div>
                    <div class="text-lg select-none text-stone-400">{data.players.online}/{data.players.max}</div>
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-24 text-left">Version</div>
                    <div class="text-lg select-none text-stone-400">{data.version.name_clean}</div>
                    {#if $error}
                        <span class="text-lg text-error select-none">Unknown</span>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div class="card h-fit bg-gradient-to-tr from-black to-zinc-800 border-1 border-neutral">
        <div class="card-body">
            <div class="stats stats-vertical">
                <div class="stat flex flex-col items-center gap-5">
                    <div class="text-lg sm:text-lg lg:text-xl select-none">Icon</div>
                    {#if data.icon}
                        <div class="flex justify-center items-center">
                            <img src={data.icon} alt="Server Icon" class="w-20 h-20 object-contain select-none">
                        </div>
                    {:else}
                        <span class="text-lg text-error select-none">Unavailable</span>
                    {/if}
                </div>

                <div class="stat flex flex-col items-center gap-5">
                    <div class="text-lg sm:text-lg lg:text-xl select-none">MOTD</div>
                    <div class="text-lg select-none">{@html data.motd.html}</div>
                    {#if $error}
                        <span class="text-lg text-error select-none">Unavailable</span>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

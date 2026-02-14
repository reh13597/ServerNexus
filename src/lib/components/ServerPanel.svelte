<script lang="ts">
    import type { ServerData } from '../types/serverInfo';
    import { error } from '../stores/server';

    export let data: ServerData;
</script>

<div class="flex flex-col w-fit xl:flex-row gap-5 xl:gap-10">
    <div class="card bg-gradient-to-tr from-black to-zinc-800 border-1 border-neutral">
        <div class="card-body">
            <div class="stats stats-vertical">
                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-30 text-left">Status</div>
                    {#if data.online}
                        <span class="text-md sm:text-md lg:text-lg text-success select-none">Online</span>
                    {:else if !data.online}
                        <span class="text-md sm:text-md lg:text-lg text-error select-none">Offline</span>
                    {:else}
                        <span class="text-md sm:text-md lg:text-lg text-error select-none">N/A</span>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-30 text-left">Host</div>
                    {#if $error}
                        <div class="text-md sm:text-md lg:text-lg text-error select-none">N/A</div>
                    {:else}
                        <div class="text-md sm:text-md lg:text-lg text-stone-400">{data.host}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-30 text-left">Port</div>
                    {#if $error}
                        <div class="text-md sm:text-md lg:text-lg text-error select-none">N/A</div>
                    {:else}
                        <div class="text-md sm:text-md lg:text-lg text-stone-400">{data.port}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-30 text-left">IP</div>
                    {#if $error}
                        <span class="text-md sm:text-md lg:text-lg text-error select-none">N/A</span>
                    {:else}
                        <div class="text-md sm:text-md lg:text-lg text-stone-400">{data.ip_address}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-30 text-left">Players</div>
                    {#if $error}
                        <div class="text-md sm:text-md lg:text-lg select-none text-error">{data.players.online}/{data.players.max}</div>
                    {:else}
                        <div class="text-md sm:text-md lg:text-lg select-none text-stone-400">{data.players.online}/{data.players.max}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-30 text-left">Version</div>
                    {#if $error}
                        <span class="text-md sm:text-md lg:text-lg text-error select-none">N/A</span>
                    {:else}
                        <div class="text-md sm:text-md lg:text-lg select-none text-stone-400">{data.version.name_clean}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-30 text-left">EULA Blocked</div>
                    {#if data.eula_blocked}
                        <span class="text-md sm:text-md lg:text-lg text-success select-none">Yes</span>
                    {:else if !data.eula_blocked}
                        <span class="text-md sm:text-md lg:text-lg text-error select-none">No</span>
                    {:else}
                        <span class="text-md sm:text-md lg:text-lg text-error select-none">No</span>
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
                            <img src={data.icon} alt="Server Icon" class="w-10 h-10 sm:w-10 sm:h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 object-contain select-none">
                        </div>
                    {:else}
                        <span class="text-lg text-error select-none">Unavailable</span>
                    {/if}
                </div>

                <div class="stat flex flex-col items-center gap-5">
                    <div class="text-lg sm:text-lg lg:text-xl select-none">MOTD</div>
                    {#if $error}
                        <span class="text-lg text-error select-none">Unavailable</span>
                    {:else}
                        <div class="text-lg select-none">{@html data.motd.html}</div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

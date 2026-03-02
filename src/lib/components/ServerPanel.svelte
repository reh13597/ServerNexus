<script lang="ts">
    import type { ServerData, ServerProfile } from '../types/serverInfo';
    import { error } from '../stores/server';

    export let profile: ServerProfile;
    export let data: ServerData;
</script>

<div class="flex flex-col w-full xl:flex-row gap-5">
    <div class="drop-shadow-xl/80 card xl:min-w-lg max-h-[60vh] overflow-y-auto bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral">
        <div class="card-body">
            <div class="stats stats-vertical">
                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Status</div>
                    {#if data.online}
                        <div class="text-md lg:text-lg text-success select-none">Online</div>
                    {:else}
                        <div class="text-md lg:text-lg text-error select-none">Offline</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Host</div>
                    {#if !data.online && !$error}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {:else}
                        <div class="text-md lg:text-lg text-stone-400">{data.host}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Port</div>
                    {#if !data.online}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {:else}
                        <div class="text-md lg:text-lg text-stone-400">{data.port}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">IP</div>
                    {#if !data.online}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {:else}
                        <div class="text-md lg:text-lg text-stone-400">{data.ip_address}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Players</div>
                    {#if !data.online}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {:else}
                        <div class="text-md lg:text-lg select-none text-stone-400">{data.players.online}/{data.players.max}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-start gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Version</div>
                    {#if !data.online}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {:else}
                        <div class="text-md lg:text-lg select-none text-stone-400 break-all">{data.version.name_clean}</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-start gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Mods</div>
                    {#if data.mods && data.mods.length > 0}
                        <div class="flex flex-wrap gap-x-2 gap-y-1 text-md lg:text-lg text-stone-400 select-none">
                            {#each data.mods as mod, i (mod.name + mod.version)}
                                <div>{mod.name}{#if mod.version}<span class="text-stone-500"> ({mod.version})</span>{/if}</div>{#if i < data.mods.length - 1}, {/if}
                            {/each}
                        </div>
                    {:else}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-start gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Plugins</div>
                    {#if data.plugins && data.plugins.length > 0}
                        <div class="flex flex-wrap gap-x-2 gap-y-1 text-md lg:text-lg text-stone-400 select-none">
                            {#each data.plugins as plugin, i (plugin.name + (plugin.version ?? ''))}
                                <div>{plugin.name}{#if plugin.version}<span class="text-stone-500"> ({plugin.version})</span>{/if}</div>{#if i < data.plugins.length - 1}, {/if}
                            {/each}
                        </div>
                    {:else}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">EULA Blocked</div>
                    {#if data.eula_blocked}
                        <div class="text-md lg:text-lg text-success select-none">Yes</div>
                    {:else if !data.eula_blocked}
                        <div class="text-md lg:text-lg text-error select-none">No</div>
                    {:else}
                        <div class="text-md lg:text-lg text-error select-none">N/A</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Protocol</div>
                    {#if data.version.protocol}
                        <div class="text-md lg:text-lg text-stone-400 select-none">{data.version.protocol}</div>
                    {:else}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {/if}
                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-md lg:text-xl select-none min-w-30 text-left">Software</div>
                    {#if data.software}
                        <div class="text-md lg:text-lg text-stone-400 select-none">{data.software}</div>
                    {:else}
                        <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col justify-between gap-5">
        <div class="drop-shadow-xl/80 card h-fit bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral">
            <div class="card-body">
                <div class="stats stats-vertical">
                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-md lg:text-xl select-none">Icon</div>
                        {#if data.icon}
                            <div class="flex justify-center items-center">
                                <img src={data.icon} alt="Server Icon" class="w-10 h-10 sm:w-10 sm:h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 object-contain select-none">
                            </div>
                        {:else}
                            <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                        {/if}
                    </div>

                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-md lg:text-xl select-none">MOTD</div>
                        {#if data.motd}
                            <div class="text-sm md:text-md lg:text-lg select-none">{@html data.motd.html}</div>
                        {:else}
                            <div class="text-md lg:text-lg text-stone-400 select-none">N/A</div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>

        <div class="drop-shadow-xl/80 card h-fit bg-gradient-to-tl from-black to-zinc-700 border-1 border-neutral">
            <div class="card-body">
                <div class="stats">
                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-md lg:text-xl select-none">Average Rating</div>
                        <div class="flex items-center gap-1">
                            <i class="fa-star fa-solid text-primary lg:text-xl md:text-lg text-md"></i>
                            {#if $error}
                                <p class="select-none text-error">0.0</p>
                            {:else}
                                <p class="select-none text-stone-400">{profile.avg_rating.toFixed(1)}</p>
                            {/if}
                        </div>
                    </div>

                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-md lg:text-xl select-none"># of Reviews</div>
                        <div class="flex items-center gap-1">
                            <i class="fa-solid fa-comment-dots text-primary lg:text-xl md:text-lg text-md"></i>
                            {#if $error}
                                <p class="select-none text-error">0</p>
                            {:else}
                                <p class="select-none text-stone-400">{profile.review_count}</p>
                            {/if}
                        </div>
                    </div>

                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-md lg:text-xl select-none"># of Saves</div>
                        <div class="flex items-center gap-1">
                            <i class="fa-bookmark fa-solid text-primary lg:text-xl md:text-lg text-md"></i>
                            {#if $error}
                                <p class="select-none text-error">0</p>
                            {:else}
                                <p class="select-none text-stone-400">{profile.save_count}</p>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

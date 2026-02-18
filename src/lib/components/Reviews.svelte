<script lang="ts">
    import type { ServerProfile } from '../types/serverInfo';
    import { error } from '../stores/server';

    export let profile: ServerProfile;
</script>

<div class="flex flex-col w-fit xl:flex-row gap-10">
    <div class="card max-h-[58.5vh] overflow-y-auto bg-gradient-to-tl from-base-100 to-zinc-700 border-1 border-neutral">
        <div class="card-body">
            <div class="stats stats-vertical">
                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Status</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Host</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Port</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">IP</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Players</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Version</div>

                </div>

                <div class="stat flex flex-row items-start gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Mods</div>

                </div>

                <div class="stat flex flex-row items-start gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Plugins</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">EULA Blocked</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Protocol Version</div>

                </div>

                <div class="stat flex flex-row items-center gap-10">
                    <div class="text-lg sm:text-lg lg:text-xl select-none min-w-45 text-left">Software</div>

                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col max-w-xl gap-10">
        <div class="card h-fit bg-gradient-to-tl from-base-100 to-zinc-700 border-1 border-neutral">
            <div class="card-body">
                <div class="stats stats-vertical">
                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-lg sm:text-lg lg:text-xl select-none">Icon</div>

                    </div>

                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-lg sm:text-lg lg:text-xl select-none">MOTD</div>

                    </div>
                </div>
            </div>
        </div>

        <div class="card h-fit bg-gradient-to-tl from-base-100 to-zinc-700 border-1 border-neutral">
            <div class="card-body">
                <div class="stats">
                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-lg sm:text-lg lg:text-xl select-none">Average Rating</div>
                        <div class="flex items-center gap-1">
                            <i class="fa-star fa-solid text-primary lg:text-xl md:text-lg sm:text-md text-md"></i>

                        </div>
                    </div>

                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-lg sm:text-lg lg:text-xl select-none"># of Reviews</div>
                        <div class="flex items-center gap-1">
                            <i class="fa-solid fa-comment-dots text-primary lg:text-xl md:text-lg sm:text-md text-md"></i>

                        </div>
                    </div>

                    <div class="stat flex flex-col items-center gap-5">
                        <div class="text-lg sm:text-lg lg:text-xl select-none"># of Saves</div>
                        <div class="flex items-center gap-1">
                            <i class="fa-bookmark fa-solid text-primary lg:text-xl md:text-lg sm:text-md text-md"></i>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

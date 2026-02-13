<script lang="ts">
    const iconWrap = "inline-flex w-fit transition duration-200 hover:scale-115 hover:bg-transparent";
    const iconClass = "text-2xl text-white hover:text-primary";
</script>

<div class="flex">
    <div class="mx-auto w-full max-w-4xl px-5 pb-10 select-none">
        <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold mt-30">Contact</h1>
        <p class="mt-5 text-md text-stone-400">Send me a message or check out my socials.</p>
        <div class="mt-10 flex gap-5 justify-center">
            <a
                target="_blank"
                rel="noreferrer"
                href="https://instagram.com/alex_guo_888/"
                aria-label="Instagram Icon/Link"
                class={iconWrap}
            >
                <i class={`fa-brands fa-instagram ${iconClass}`}></i>
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/reh13597"
                aria-label="GitHub Icon/Link"
                class={iconWrap}
            >
                <i class={`fa-brands fa-github ${iconClass}`}></i>
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                href="https://www.linkedin.com/in/-alex-guo-/"
                aria-label="LinkedIn Icon/Link"
                class={iconWrap}
            >
                <i class={`fa-brands fa-linkedin ${iconClass}`}></i>
            </a>
        </div>
        <div class="mt-10 flex flex-col gap-10 md:flex-row justify-center">
            <form
                class="w-full md:w-1/2 space-y-4 bg-gradient-to-tr from-black to-zinc-700 rounded-xl p-5 shadow-lg border-1 border-neutral"
                on:submit|preventDefault>
                <div>
                    <label for="name" class="block text-sm font-semibold mb-3 text-left">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Herobrine Persson"
                        class="input input-bordered w-full bg-base-300" />
                </div>

                <div>
                    <label for="email" class="block text-sm font-semibold mb-3 text-left">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="herobrine@nether.com"
                        class="input input-bordered w-full bg-base-300" />
                </div>

                <div>
                    <label for="subject" class="block text-sm font-semibold mb-3 text-left">Subject</label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this about?"
                        class="input input-bordered w-full bg-base-300" />
                </div>

                <div>
                    <label for="message" class="block text-sm font-semibold mb-3 text-left">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        placeholder="Write your message here..."
                        class="textarea textarea-bordered w-full mb-3 bg-base-300"></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-lg">
                    Send
                </button>
            </form>
        </div>
    </div>
</div>

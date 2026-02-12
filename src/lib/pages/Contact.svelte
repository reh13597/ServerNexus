<script lang="ts">
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
    import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

    const iconWrap = "inline-flex w-fit transition duration-200 hover:scale-115 hover:bg-transparent";
    const iconClass = "text-4xl text-white hover:text-primary";
</script>

<div class="px-5 pb-10 select-none text-left">
    <div class="mx-auto max-w-4xl">
        <h1 class="text-6xl font-bold mt-30">Contact</h1>
        <div class="mt-10 flex flex-col gap-10 md:flex-row">
            <form
                class="w-full md:w-1/2 space-y-4 bg-base-200/40 rounded-xl p-5 shadow-lg border border-base-300/60"
                on:submit|preventDefault>
                <div>
                    <label for="name" class="block text-sm font-semibold mb-1">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        class="input input-bordered w-full" />
                </div>

                <div>
                    <label for="email" class="block text-sm font-semibold mb-1">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        class="input input-bordered w-full" />
                </div>

                <div>
                    <label for="subject" class="block text-sm font-semibold mb-1">Subject</label>
                    <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="What is this about?"
                        class="input input-bordered w-full" />
                </div>

                <div>
                    <label for="message" class="block text-sm font-semibold mb-1">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        placeholder="Write your message here..."
                        class="textarea textarea-bordered w-full resize-none"></textarea>
                </div>

                <button type="submit" class="btn btn-primary w-full md:w-auto">
                    Send Message
                </button>
            </form>

            <div class="w-full md:w-1/2 md:pl-4">
                <p class="text-xl">Or check out my socials!</p>
                <div class="flex gap-8 mt-6 -mx-1">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://instagram.com/alex_guo_888/"
                        class={iconWrap}
                    >
                        <FontAwesomeIcon icon={faInstagram} class={iconClass} />
                    </a>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://github.com/reh13597"
                        class={iconWrap}
                    >
                        <FontAwesomeIcon icon={faGithub} class={iconClass} />
                    </a>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://www.linkedin.com/in/-alex-guo-/"
                        class={iconWrap}
                    >
                        <FontAwesomeIcon icon={faLinkedin} class={iconClass} />
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

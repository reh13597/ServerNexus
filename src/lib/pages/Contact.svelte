<script lang="ts">
    import emailjs from '@emailjs/browser';
    import { onDestroy } from 'svelte';
    import { name, email, subject, message } from '../stores/email';

    const iconWrap = "inline-flex w-fit transition duration-200 hover:scale-110 hover:bg-transparent";
    const iconClass = "text-2xl text-white hover:text-primary";
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    let isSubmitting = false;
    let submitError = false;
    let submitSuccess = false;
    let isFormValid = false;

    $: isFormValid = $name.trim().length > 0 &&
                     $email.trim().length > 0 &&
                     $subject.trim().length > 0 &&
                     $message.trim().length >= 20;

    $: charsRemaining = Math.max(0, 20 - $message.trim().length);

    async function sendEmail(e: Event) {
        e.preventDefault()

        if (!isFormValid || isSubmitting) {
            return;
        }

        isSubmitting = true;
        submitError = false;
        submitSuccess = false;

        try {
            await emailjs.sendForm(serviceID, templateID, e.target as HTMLFormElement, publicKey);
            submitSuccess = true;
            name.set('');
            email.set('');
            subject.set('');
            message.set('');
            setTimeout(() => submitSuccess = false, 6000);
        } catch (error) {
            console.error('Failed to send email:', error);
            submitError = true;
            setTimeout(() => submitError = false, 6000);
        } finally {
            isSubmitting = false;
        }
    }

    onDestroy(() => {
        name.set('');
        email.set('');
        subject.set('');
        message.set('');
    });
</script>

<div class="mx-auto max-w-4xl px-10 select-none pb-10">
    <h1 class="lg:text-4xl md:text-3xl text-2xl font-bold mt-25 md:mt-30">Contact</h1>
    <p class="mt-5 text-sm md:text-md text-stone-400">Send me a message or check out my socials.</p>
    <div class="mt-5 flex gap-5 justify-center">
        <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/reh13597/ServerNexus"
            aria-label="GitHub Icon/Link"
            class={iconWrap}
        >
            <i class={`drop-shadow-xl/80 fa-brands fa-github ${iconClass}`}></i>
        </a>
        <a
            target="_blank"
            rel="noreferrer"
            href="https://www.linkedin.com/in/-alex-guo-/"
            aria-label="LinkedIn Icon/Link"
            class={iconWrap}
        >
            <i class={`drop-shadow-xl/80 fa-brands fa-linkedin ${iconClass}`}></i>
        </a>
    </div>
    <div class="mt-10 flex flex-col gap-10 md:flex-row justify-center">
        <form
            class="md:min-w-1/2 space-y-4 bg-gradient-to-tr from-black to-zinc-700 rounded-xl p-5 drop-shadow-xl/80 border-1 border-neutral"
            on:submit={sendEmail}
        >
            <div>
                <label for="name" class="block text-sm font-semibold mb-3 text-left">Name</label>
                <input
                    bind:value={$name}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Herobrine Persson"
                    class="input input-bordered w-full bg-base-300" />
            </div>

            <div>
                <label for="email" class="block text-sm font-semibold mb-3 text-left">Email</label>
                <input
                    bind:value={$email}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="herobrine@nether.com"
                    class="input input-bordered w-full bg-base-300" />
            </div>

            <div>
                <label for="subject" class="block text-sm font-semibold mb-3 text-left">Subject</label>
                <input
                    bind:value={$subject}
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is this about?"
                    class="input input-bordered w-full bg-base-300" />
            </div>

            <div>
                <label for="message" class="block text-sm font-semibold mb-3 text-left">Message</label>
                <textarea
                    bind:value={$message}
                    id="message"
                    name="message"
                    rows="4"
                    placeholder="Write your message here..."
                    class="textarea textarea-bordered w-full mb-3 bg-base-300"
                >
                </textarea>

                {#if charsRemaining > 0 && !submitError && !submitSuccess}
                    <p class="text-xs text-stone-400">{charsRemaining} more character{charsRemaining !== 1 ? 's' : ''} required</p>
                {/if}
                {#if submitError}
                    <p class="text-error text-xs">Failed to send message. Please try again.</p>
                {/if}
                {#if submitSuccess}
                    <p class="text-success text-xs">Message sent successfully!</p>
                {/if}
            </div>

            <button type="submit"
                class="btn btn-primary w-full hover:scale-102 transition duration-200"
                disabled={!isFormValid || isSubmitting}
            >
                {#if isSubmitting}
                    <span class="loading loading-spinner loading-sm"></span> Sending...
                {:else}
                    Send Message
                {/if}
            </button>
        </form>
    </div>
</div>

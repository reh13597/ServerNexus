<div class="flex">
    <div class="mx-auto w-full max-w-4xl px-5 pb-10 select-none">
        <h1 class="lg:text-6xl md:text-5xl sm:text-4xl text-4xl font-bold mt-30">Contact</h1>
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
                        placeholder="Your name"
                        class="input input-bordered w-full bg-base-300" />
                </div>

                <div>
                    <label for="email" class="block text-sm font-semibold mb-3 text-left">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
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

import { supabase } from '../supabase';

let idleTimeout: ReturnType<typeof setTimeout> | null = null;
const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

function resetTimer() {
	if (idleTimeout) {
        clearTimeout(idleTimeout);
    }

	idleTimeout = setTimeout(() => {
		supabase.auth.signOut();
	}, IDLE_TIME);
}

export function startIdleTimer() {
	const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
	events.forEach((event) => window.addEventListener(event, resetTimer));

	resetTimer();
}

export function stopIdleTimer() {
	const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
	events.forEach((event) => window.removeEventListener(event, resetTimer));

	if (idleTimeout) {
        clearTimeout(idleTimeout);
    }

}

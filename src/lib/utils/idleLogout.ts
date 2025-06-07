import { supabase } from '../supabase';

let idleTimeout: ReturnType<typeof setTimeout> | null = null;
const IDLE_TIME = 1 * 60 * 1000; // 1 minute

function resetTimer() {
	if (idleTimeout) {
        clearTimeout(idleTimeout);
    }

	console.log('✅ Activity detected. Timer reset.');
	idleTimeout = setTimeout(() => {
		supabase.auth.signOut();
	}, IDLE_TIME);
}

export function startIdleTimer() {
	const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
	events.forEach((event) => window.addEventListener(event, resetTimer));

	console.log('🟢 Idle timer started.');
	resetTimer();
}

export function stopIdleTimer() {
	const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
	events.forEach((event) => window.removeEventListener(event, resetTimer));

	if (idleTimeout) {
        clearTimeout(idleTimeout);
    }

	console.log('⛔ Idle timer stopped.');
}

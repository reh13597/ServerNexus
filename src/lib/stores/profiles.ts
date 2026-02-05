import { writable, get } from 'svelte/store';
import { supabase } from '../supabase';
import { userID } from './user';
import type { ServerProfile } from '../types/serverInfo';

export const privateProfiles = writable(false);

export const onProfile = writable(false);

export const publicProfile = writable(false);

export const serverProfile = writable<ServerProfile | null>(null);

function createProfilesStore() {
    const { subscribe, set, update } = writable<ServerProfile[]>([]);

    let channel: any = null;

    const fetchAndSubscribe = async () => {
        const uid = get(userID);

        const { data, error } = await supabase
            .from('servers')
            .select('*')
            /* .eq('id', uid); */

        if (error) {
            console.error('Error fetching profiles:', error);
            return;
        }

        set(data);

        channel = supabase
            .channel('public:servers')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'servers'
                },
                (payload) => {
                    update((profiles) => {
                        if (payload.eventType === 'INSERT') {
                            return [payload.new, ...profiles];
                        }

                        if (payload.eventType === 'UPDATE') {
                            return profiles.map((p) =>
                                p.id === payload.new.id ? payload.new : p
                            );
                        }

                        if (payload.eventType === 'DELETE') {
                            return profiles.filter((p) => p.id !== payload.old.id);
                        }

                        return profiles;
                    });
                }
            )
            .subscribe();
    };

    const unsubscribe = () => {
        if (channel) {
            supabase.removeChannel(channel);
            channel = null;
        }
    };

    return {
        subscribe,
        fetchAndSubscribe,
        unsubscribe
    };
}

export const serverProfiles = createProfilesStore();
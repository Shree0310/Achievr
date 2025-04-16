"use server"

import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { Provider } from '@supabase/supabase-js';

const signInWith = (provider: Provider) => async () => {
    const supabase = await createClient();

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    })

    if (error) {
        console.log(error);
    }

    if (!data.url) {
        throw new Error('No redirect URL provided');
    }

    redirect(data.url);
}

const signInWithGoogle = signInWith('google');

export { signInWithGoogle }
"use server"

import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { RedirectType } from 'next/navigation';

const signInWith = (provider: any) => async () => {
    const supabase = await createClient();

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: auth_callback_url,
        },
    })

    console.log(data);

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
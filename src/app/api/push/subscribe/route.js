import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  try {
    const supabase = await createClient();
    const { subscription, userId } = await request.json();

    // Store subscription in database
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: subscription,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error storing subscription:', error);
      return NextResponse.json({ error: 'Failed to store subscription' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in subscribe route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
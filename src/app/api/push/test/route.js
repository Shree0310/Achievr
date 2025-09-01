import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure VAPID keys
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

// Only set VAPID details if keys are available
if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    'mailto:your-email@example.com', // Replace with your email
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

export async function POST(request) {
  try {
    // Check if VAPID keys are configured
    if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
      return NextResponse.json({ 
        error: 'Push notifications not configured. Missing VAPID keys.',
        details: 'Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.'
      }, { status: 500 });
    }

    const { subscription, title, message } = await request.json();

    const payload = JSON.stringify({
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
    });

    const result = await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ 
      success: true, 
      message: 'Test notification sent successfully',
      result 
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ 
      error: 'Failed to send notification',
      details: error.message 
    }, { status: 500 });
  }
} 
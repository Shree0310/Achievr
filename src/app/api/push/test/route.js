import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure VAPID keys
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your email
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request) {
  try {
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
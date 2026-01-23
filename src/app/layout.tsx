// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "../app/contexts/NotificationContext";
import { ThemeProvider } from "../app/contexts/ThemeContext";
import { SessionProviderWrapper } from "@/app/providers/SessionProvider";
import NotificationSubscription from "../app/Components/Notifications/NotificationSubscription";
import PushNotificationManager from "../app/Components/Notifications/PushNotificationManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Achievr - Task Management Board",
  description:
    "Streamline your workflow with our intuitive Kanban task management solution",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-50 dark:bg-neutral-900 text-gray-900 dark:text-white transition-colors duration-300`}>
        <SessionProviderWrapper>
          <ThemeProvider>
            <NotificationProvider>
              <NotificationSubscription />
              <PushNotificationManager />
              {children}
            </NotificationProvider>
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
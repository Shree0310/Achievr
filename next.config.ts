import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: only load resources from same origin
              "default-src 'self'",

              // Scripts: Next.js requires 'unsafe-eval' for Fast Refresh in dev, 'unsafe-inline' for chunks
              // TODO: Move to nonces or hashes for production if possible
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",

              // Styles: Allow same-origin + Google Fonts + inline styles (Tailwind, Next.js)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              // Fonts: Google Fonts static assets
              "font-src 'self' https://fonts.gstatic.com",

              // Images: Same origin + data URIs (base64 images) + Supabase storage + Google profile pics
              "img-src 'self' data: https://wjnbgwstdplgpgucbwoc.supabase.co https://*.googleusercontent.com https://*.gstatic.com",

              // Connections: Critical for Achievr functionality
              "connect-src 'self' https://wjnbgwstdplgpgucbwoc.supabase.co wss://wjnbgwstdplgpgucbwoc.supabase.co https://api.github.com https://github.com https://accounts.google.com https://*.google.com https://api.openai.com",

              // Frame src: Allow Google OAuth popup/iframe
              "frame-src 'self' https://accounts.google.com https://*.google.com",

              // Frame ancestors: Prevent clickjacking - Achievr should never be embedded
              "frame-ancestors 'none'",

              // Object/embed: Block plugins (Flash, Java, etc.)
              "object-src 'none'",

              // Base URI: Prevent base tag injection
              "base-uri 'self'",

              // Form actions: Only allow forms to submit to same origin
              "form-action 'self' https://github.com https://accounts.google.com", // OAuth flows
            ]
              .map(directive => directive.replace(/\s+/g, ' ').trim())
              .join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
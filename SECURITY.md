# Security Implementation - Achievr

## Overview

This document details the security headers implemented for Achievr, a Next.js task management application with Supabase backend, OpenAI integration, and GitHub/Google OAuth.

All security headers are configured in [`next.config.ts`](next.config.ts) and applied to all routes via Next.js's `headers()` function.

---

## Content Security Policy (CSP)

### Implementation

The CSP is built specifically for Achievr's actual dependencies, not from a generic template. Each directive addresses a real requirement or threat vector.

### Directives Explained

#### `default-src 'self'`
**Purpose:** Start restrictive - only allow resources from the same origin by default.
**Rationale:** Forces explicit allowlisting for external resources. Any resource not covered by another directive falls back to this.

#### `script-src 'self' 'unsafe-eval' 'unsafe-inline'`
**Purpose:** Allow scripts from same origin + Next.js requirements.
**Why `'unsafe-eval'`:** Next.js Fast Refresh (dev mode) requires `eval()` for hot module replacement.
**Why `'unsafe-inline'`:** Next.js chunks inject inline scripts during hydration.
**Security note:** In production, these could be replaced with nonces or hashes, but Next.js makes this complex. Trade-off accepted for framework compatibility.
**Threat mitigated:** XSS attacks from third-party script injection.

#### `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
**Purpose:** Allow Tailwind CSS (inline), same-origin stylesheets, and Google Fonts CSS.
**Why `'unsafe-inline'`:** Tailwind generates utility classes that Next.js injects inline.
**Why `https://fonts.googleapis.com`:** Geist and Geist Mono fonts loaded in [`layout.tsx:3`](src/app/layout.tsx#L3).
**Threat mitigated:** CSS injection attacks, clickjacking via hidden style overlays.

#### `font-src 'self' https://fonts.gstatic.com`
**Purpose:** Allow Google Fonts static assets (WOFF2 files).
**Specific to Achievr:** `https://fonts.gstatic.com` serves Geist/Geist Mono font files.
**Threat mitigated:** Font-based fingerprinting attacks, malicious font file injection.

#### `img-src 'self' data: https://wjnbgwstdplgpgucbwoc.supabase.co https://*.googleusercontent.com https://*.gstatic.com`
**Purpose:** Allow images from Supabase storage, Google profile pictures, and base64 data URIs.
**Why `data:`:** Base64-encoded images (common in UI components).
**Why `https://wjnbgwstdplgpgucbwoc.supabase.co`:** Achievr's Supabase project storage bucket.
**Why `https://*.googleusercontent.com`:** Google OAuth returns user profile pictures from this domain.
**Why `https://*.gstatic.com`:** Google static assets (icons, UI elements).
**Threat mitigated:** Image-based XSS (SVG exploit vectors), phishing via fake UI images.

#### `connect-src` (CRITICAL for Achievr)
```
'self'
https://wjnbgwstdplgpgucbwoc.supabase.co
wss://wjnbgwstdplgpgucbwoc.supabase.co
https://api.github.com
https://github.com
https://accounts.google.com
https://*.google.com
https://api.openai.com
```

**Purpose:** Allow AJAX/fetch/WebSocket connections to specific origins.
**Most critical directive:** `wss://wjnbgwstdplgpgucbwoc.supabase.co` - **Supabase Realtime WebSocket**.

**Detailed breakdown:**
- **`'self'`** - Next.js API routes (`/api/*`)
- **`https://wjnbgwstdplgpgucbwoc.supabase.co`** - Supabase REST API (PostgREST) for CRUD operations
- **`wss://wjnbgwstdplgpgucbwoc.supabase.co`** - **Supabase Realtime WebSocket** (CRITICAL)
  - **Why this is critical:** Without this, real-time task updates break silently. The Supabase client will fail to establish a WebSocket connection, and multi-user sync stops working. No error appears in the console - the feature just stops.
  - **How to test:** Open two browser windows. Create a task in one. Without this directive, the other window won't see the update.
- **`https://api.github.com`** - GitHub REST API for repository integration
- **`https://github.com`** - GitHub OAuth redirects
- **`https://accounts.google.com`** - Google OAuth redirects/API
- **`https://*.google.com`** - Google OAuth subdomains
- **`https://api.openai.com`** - OpenAI GPT-4o-mini (AI planner feature in [`src/app/api/planner/route.ts`](src/app/api/planner/route.ts))

**Threat mitigated:** Prevents exfiltration of user data to unauthorized servers.

#### `frame-src 'self' https://accounts.google.com https://*.google.com`
**Purpose:** Allow Google OAuth popup/iframe for sign-in flow.
**Why needed:** Google OAuth uses an iframe or popup window for authentication.
**Specific to Achievr:** Without this, Google sign-in fails (confirmed via [`src/app/actions/auth.ts:35`](src/app/actions/auth.ts#L35)).
**Threat mitigated:** Clickjacking attacks via malicious iframes.

#### `frame-ancestors 'none'`
**Purpose:** Prevent Achievr from being embedded in any iframe (even same-origin).
**Rationale:** Achievr is a standalone app - there's no legitimate reason for it to be iframed.
**Threat mitigated:** Clickjacking attacks where an attacker embeds Achievr in a malicious site and tricks users into performing actions.
**Note:** This is redundant with `X-Frame-Options: DENY` but included for browser compatibility (some browsers only respect CSP, not X-Frame-Options).

#### `object-src 'none'`
**Purpose:** Block all `<object>`, `<embed>`, `<applet>` tags.
**Rationale:** Achievr doesn't use Flash, Java applets, or any plugin-based content.
**Threat mitigated:** Exploit vectors via Flash/Java plugin vulnerabilities (legacy threat, but still blocked).

#### `base-uri 'self'`
**Purpose:** Restrict `<base>` tag href to same-origin only.
**Threat mitigated:** Base tag injection attacks where an attacker injects `<base href="https://evil.com">` to redirect all relative URLs to a malicious server.
**Why this matters:** All relative links in Achievr (`/board`, `/auth`, etc.) would point to `https://evil.com/board` if an attacker could inject a base tag.

#### `form-action 'self' https://github.com https://accounts.google.com`
**Purpose:** Allow forms to submit to same-origin or OAuth endpoints only.
**Specific to Achievr:** OAuth flows require form submissions to GitHub and Google.
**Threat mitigated:** Prevents forms from submitting user data to unauthorized endpoints (data exfiltration).

#### `upgrade-insecure-requests`
**Purpose:** Automatically upgrade HTTP requests to HTTPS.
**Rationale:** Forces all HTTP links/assets to load via HTTPS instead.
**Threat mitigated:** Man-in-the-middle attacks on insecure HTTP connections.

---

## Other Security Headers

### Strict-Transport-Security (HSTS)
**Value:** `max-age=31536000; includeSubDomains; preload`

**Purpose:** Force browsers to always use HTTPS, preventing SSL-stripping attacks.

**What it does:**
- `max-age=31536000` - Browser remembers to use HTTPS for 1 year (31,536,000 seconds)
- `includeSubDomains` - Applies to all subdomains
- `preload` - Eligible for Chrome's HSTS preload list

**Example attack prevented:**
- Attacker performs man-in-the-middle attack on public WiFi
- Tries to downgrade user's connection from HTTPS to HTTP
- With HSTS: Browser refuses, shows error instead
- Without HSTS: Connection downgraded, attacker can intercept traffic

**Why Achievr needs this:** Protects users on insecure networks (coffee shops, airports) from having their session tokens stolen.

**Note:** Only works in production (HTTPS). Localhost (HTTP) ignores this header.

### X-Content-Type-Options: nosniff
**Purpose:** Prevent MIME-sniffing attacks.
**What it does:** Forces browsers to respect the `Content-Type` header instead of guessing the file type.
**Example attack prevented:**
- Attacker uploads `malicious.jpg` that's actually HTML with `<script>` tags
- Without `nosniff`, browser might execute it as HTML
- With `nosniff`, browser treats it as an image and won't execute

**Why Achievr needs this:** User-uploaded files via Supabase storage could be disguised executables.

### Referrer-Policy: strict-origin-when-cross-origin
**Purpose:** Control how much referrer information is sent with requests.
**What it does:**
- Same-origin requests: Full URL sent (e.g., `https://achievr.com/board/task-123`)
- Cross-origin requests: Only origin sent (e.g., `https://achievr.com`)
- Downgrade (HTTPS → HTTP): No referrer sent

**Why Achievr needs this:**
- Prevents leaking sensitive URLs (task IDs, user data) to third-party services
- Example: If a user clicks a link in a task description to `https://external-site.com`, that site only sees `https://achievr.sourashreeart.com`, not the full task URL with IDs

**Privacy benefit:** Protects user task data from being leaked via referrer headers.

### X-Frame-Options: DENY
**Purpose:** Prevent Achievr from being embedded in any iframe.
**Redundancy:** Overlaps with CSP `frame-ancestors 'none'` for older browser support.
**Threat mitigated:** Clickjacking attacks.
**Why DENY instead of SAMEORIGIN:** Achievr has no legitimate use case for iframing, even from the same origin.

### Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
**Purpose:** Disable unused browser features globally.
**What each directive does:**
- **`camera=()`** - Blocks all camera access (Achievr doesn't need it)
- **`microphone=()`** - Blocks all microphone access (Achievr doesn't need it)
- **`geolocation=()`** - Blocks all location tracking (Achievr doesn't need it)
- **`interest-cohort=()`** - Opts out of Google's FLoC tracking (privacy protection)

**Why Achievr needs this:**
- **Attack surface reduction:** Even if an XSS vulnerability exists, attackers can't access these APIs
- **Privacy:** Prevents third-party scripts (if ever added) from accessing sensitive user hardware
- **FLoC opt-out:** Protects user privacy from Google's behavioral advertising tracking

---

## Testing & Validation

### Local Testing Results
**Date:** September 23, 2026
**Environment:** Development (localhost:3000)

#### Console Violations: **ZERO**
No CSP violations detected during full flow testing:
- ✅ App loads (fonts, styles, images)
- ✅ Supabase REST API calls (task CRUD)
- ✅ Supabase Realtime WebSocket (tested with two browser windows)
- ✅ Google OAuth flow (sign-in popup)
- ✅ OpenAI API (AI planner)
- ✅ GitHub integration

#### Real-Time Sync Test (CRITICAL)
**Test:** Open two browser windows, create task in Window A, verify it appears in Window B.
**Result:** ✅ PASS - WebSocket connection allowed via `wss://wjnbgwstdplgpgucbwoc.supabase.co` in `connect-src`.
**What would happen without it:** Window B would never receive updates (silent failure, no console error).

---

## Production Deployment Notes

### Verifying Headers in Production

After deploying to Vercel, verify headers are present:

```bash
curl -I https://achievr.sourashreeart.com
```

Expected output should include:
```
strict-transport-security: max-age=31536000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; ...
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
x-frame-options: DENY
permissions-policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

### Testing with Online Tools

After deployment, validate your security headers:

1. **SecurityHeaders.com**
   - Visit: https://securityheaders.com
   - Enter: `https://achievr.sourashreeart.com`
   - Target grade: **A or A+**

2. **CSP Evaluator (Google)**
   - Visit: https://csp-evaluator.withgoogle.com/
   - Paste your CSP string from the curl output
   - Expected warnings: `'unsafe-inline'` and `'unsafe-eval'` (acceptable for Next.js)

3. **Mozilla Observatory**
   - Visit: https://observatory.mozilla.org/
   - Scan: `achievr.sourashreeart.com`
   - Target score: **A or A+**

### Known Limitations

1. **`unsafe-inline` and `unsafe-eval` in `script-src`**
   - **Risk:** Reduces XSS protection effectiveness
   - **Why accepted:** Next.js framework requirement
   - **Future improvement:** Implement nonces via middleware for production builds

2. **Wildcard in `connect-src` for Google (`https://*.google.com`)**
   - **Risk:** Allows connections to any Google subdomain
   - **Why accepted:** Google OAuth redirects to unpredictable subdomains
   - **Mitigation:** Limited to HTTPS only, no HTTP wildcard

---

## Interview Talking Points

### CSP (Content Security Policy)
**Q: What is CSP and why does it matter?**
A: CSP is a browser security feature that prevents XSS attacks by allowlisting which resources (scripts, styles, images, API connections) can load. Without CSP, a single XSS vulnerability could execute arbitrary JavaScript, steal session tokens, or exfiltrate user data.

**Q: Why is `'unsafe-inline'` risky?**
A: It allows inline `<script>` tags and event handlers (`onclick="..."`), which are the primary vectors for XSS attacks. If an attacker can inject `<script>alert('XSS')</script>` into a page (e.g., via a vulnerable comment field), it will execute. With a strict CSP (no `'unsafe-inline'`), the browser would block it. Achievr uses it because Next.js requires it for hydration, but this is a known trade-off in React frameworks.

**Q: What does `frame-ancestors 'none'` prevent?**
A: Clickjacking attacks. An attacker could embed Achievr in an invisible iframe on a malicious site, overlay fake UI elements, and trick users into clicking "Delete All Tasks" while thinking they're clicking a fake "Play Game" button. `frame-ancestors 'none'` prevents Achievr from being iframed entirely.

**Q: Why is `connect-src` so important for Achievr specifically?**
A: Achievr uses Supabase Realtime for live task updates. The critical directive is `wss://wjnbgwstdplgpgucbwoc.supabase.co` (WebSocket). Without it, the WebSocket connection silently fails - no error appears in the console, but real-time sync stops working. This is the most common CSP issue for Supabase apps and the easiest to miss in testing.

### MIME-Sniffing (X-Content-Type-Options)
**Q: What is MIME-sniffing and why is it dangerous?**
A: Browsers try to "help" by guessing file types when the `Content-Type` header is missing or wrong. For example, if a user uploads `evil.jpg` that's actually HTML with `<script>`, the browser might execute it as HTML instead of displaying it as an image. `X-Content-Type-Options: nosniff` forces the browser to trust the server's `Content-Type` header, preventing this attack.

### Referrer Policy
**Q: What information does the Referrer header leak?**
A: The full URL the user came from, including query parameters and path. For Achievr, this could include task IDs (`/board/task-12345`), exposing which tasks exist. With `strict-origin-when-cross-origin`, external sites only see `https://achievr.sourashreeart.com`, not the task ID.

### CORS (Bonus - Not Implemented Yet)
**Q: How does Achievr handle CORS?**
A: Supabase handles CORS for its own endpoints (configured in Supabase dashboard). Achievr's custom API routes (`/api/planner`) don't need CORS since they're same-origin. If Achievr added a public API for third parties, we'd use Next.js middleware to set `Access-Control-Allow-Origin` headers with an allowlist of trusted domains.

---

## Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Evaluator (Google)](https://csp-evaluator.withgoogle.com/)
- [Supabase Realtime Security](https://supabase.com/docs/guides/realtime/security)
- [OWASP: Clickjacking Defense](https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html)

---

**Last Updated:** September 23, 2026
**Author:** Sourashree (with Claude Code assistance)

# Claude Code Skills for Next.js Pilates/Yoga Website

This folder contains 16 custom skills designed to optimize Claude Code's output for your Next.js App Router project with TypeScript, Tailwind CSS, shadcn/ui, next-intl i18n, and more.

## Installation

Copy the entire `skills` folder to your project's `.claude` directory:

```
your-project/
├── .claude/
│   └── skills/           ← Place skills here
│       ├── nextjs-app-router/
│       ├── typescript-strict/
│       └── ...
├── app/
├── components/
└── ...
```

## Skills Overview

### Core Framework (3 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `nextjs-app-router` | Next.js 15 patterns, Server/Client Components, async params | Routes, layouts, Server Actions, data fetching |
| `typescript-strict` | Type patterns, interfaces, generics, type guards | Type definitions, generics, nullable handling |
| `tailwind-shadcn` | Tailwind utilities + shadcn/ui components | Styling, component installation, theming |

### Internationalization & Content (2 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `next-intl-i18n` | 6-locale setup, translations, language switching | Adding translations, locale routing |
| `json-content-management` | JSON content architecture with TypeScript | Data schemas, content fetching |

### Forms & Validation (1 skill)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `zod-react-hook-form` | Zod + React Hook Form + Server Actions | Form validation, submission handling |

### SEO & Structured Data (3 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `seo-metadata` | Dynamic metadata, hreflang, Open Graph | Page metadata, social sharing |
| `json-ld-schemas` | Schema.org structured data components | Rich snippets, Organization, FAQ, etc. |
| `sitemap-robots` | Sitemap generation, robots.txt, llms.txt | Search engine crawling, AI visibility |

### Payments & Integrations (2 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `stripe-checkout` | Stripe Checkout, webhooks, security | Payment integration, checkout flows |
| `email-resend` | Resend API for transactional emails | Contact forms, booking notifications |

### UI & Design System (3 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `theme-system` | 4-theme CSS variables architecture | Theme switching, color schemes |
| `framer-motion-animations` | Subtle animations, scroll effects | Adding animations, page transitions |
| `responsive-mobile-first` | Mobile-first patterns, sticky headers | Responsive layouts, mobile nav |

### Development Workflow (2 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| `component-architecture` | Reusable component patterns | Creating components, prop interfaces |
| `accessibility-a11y` | WCAG compliance, keyboard nav | Accessibility, screen readers |

## How Skills Work

Skills use **progressive disclosure** to minimize context window usage:

1. **Metadata only** (~100 tokens/skill) - Always loaded for triggering
2. **Full SKILL.md** - Loaded when triggered by matching request
3. **Reference files** - Loaded only when Claude needs deeper patterns

## Skill Combinations

Common skill combinations for tasks:

**Creating a new page:**
- `nextjs-app-router` + `next-intl-i18n` + `seo-metadata`

**Building a form:**
- `zod-react-hook-form` + `tailwind-shadcn` + `accessibility-a11y`

**Adding a new service/programme:**
- `json-content-management` + `component-architecture` + `json-ld-schemas`

**Implementing payments:**
- `stripe-checkout` + `email-resend` + `nextjs-app-router`

## Customization

These skills are designed for your specific project. You can:

1. **Modify** - Edit SKILL.md files to match your exact patterns
2. **Extend** - Add reference files for detailed documentation
3. **Remove** - Delete skills you don't need
4. **Add** - Create new skills for project-specific patterns

## Token Efficiency

Total metadata overhead: ~1,600 tokens (16 skills × ~100 tokens)

Individual skill bodies range from 4,500-9,000 tokens but are only loaded when needed.

## Questions?

These skills follow best practices from:
- [Claude Code Skills Documentation](https://docs.claude.com/en/docs/agents-and-tools/agent-skills)
- [Anthropic Skills Repository](https://github.com/anthropics/skills)

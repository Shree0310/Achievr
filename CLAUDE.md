# Achievr Project

## Stack
- Next.js 14 App Router
- TypeScript strict mode
- Tailwind CSS
- Framer Motion for animations
- shadcn/ui components
- Supabase backend
- Vercel AI SDK v6 with Claude tool calling

## Animation Standards
- Use Framer Motion for all animations
- Skeleton loaders for AI responses
- Staggered animations for task cards (100ms delay)
- Spring physics: { type: "spring", stiffness: 300, damping: 30 }

## Code Conventions
- Components in src/components/
- Hooks in src/hooks/
- Server actions in src/actions/
- Always use "use client" for interactive components
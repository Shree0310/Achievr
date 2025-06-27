This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. Configure Google OAuth in your Supabase project:
   - Go to Supabase Dashboard → Authentication → Providers → Google
   - Add your Google OAuth credentials
   - Set the redirect URL to: `your_supabase_project_url/auth/v1/callback`

### Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Kanban Board
- With Drag and drop functionality
- React beautiful DnD

## React DnD Kit
- has smooth animations out of the box
- Build for list reordering
- Nice Accessibility features
- npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

## Features of React DnD Kit
- Sortable lists
- Draggable items
- Droppable zones
- Touch Support ??
- Multiple drag option

## For a Kanban Board 
- We will amek each task draggable
- Make each stage/column Droppable zone
- Update the task status whenever a task is dragged and dropped from one stage to another.
- Save Changes in supabase whenever a task status changes.
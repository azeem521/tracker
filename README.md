# Expance Tracker (Next.js + MongoDB Atlas)

Minimal scaffold for an expense management app with income/expense/charity/savings tracking, summaries, charts, zakat reminders, recurring entries, export, and notifications.

Setup

1. Copy `.env.example` to `.env.local` and set `MONGODB_URI`.
2. Install dependencies:
```
npm install
```
3. Run dev server:
```
npm run dev
```

APIs

- `GET/POST /api/entries` - manage entries
- `GET/POST /api/charity` - charity goal and summary
- `GET/POST /api/zakat` - zakat checks

This scaffold contains models, API routes, and simple React components to extend.

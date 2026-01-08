# LearnFlow AI

<!-- badges: start -->
![Vite](https://img.shields.io/badge/Vite-5A46FF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-0B0F14?logo=supabase&logoColor=3ECF8E)
![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?logo=google&logoColor=white)
<!-- badges: end -->

Turn study notes into interactive quizzes and track performance over time with analytics.

**One-liner:** Notes → Quizzes → Insights → Better scores

## Demo
- Walkthrough video: (add link)

## What it does
- Generates quizzes from notes using Google Gemini.
- Tracks quiz performance with analytics (Recharts).
- Includes Flashcards, Goals, History, and Results.
- Auth + user data stored in Supabase.

## Tech stack
- Frontend: React + TypeScript + Vite
- Routing: `react-router-dom` (HashRouter)
- State: Zustand
- UI: Framer Motion, Lucide, `clsx`, `tailwind-merge`
- AI: `@google/genai` (Gemini)
- PDF: `pdfjs-dist`
- Backend/Auth/DB: `@supabase/supabase-js`

## Routes
- Landing
- Dashboard
- CreateQuiz
- QuizPlayer
- Results
- History
- Settings
- Goals
- Login
- Flashcards

Protected routes are gated behind auth (see `ProtectedRoute`).

## Run locally

### Prerequisites
- Node.js (LTS recommended)

### 1) Install
```bash
npm install
2) Configure environment variables
Create a file named .env.local in the project root:

bash
GEMINI_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
3) Start dev server
bash
npm run dev
4) Build & preview
Build:

bash
npm run build
Preview:

bash
npm run preview
Deployment
This is a standard Vite static build.

Build command:

bash
npm run build
Output directory:

dist

Set environment variables in your hosting dashboard:

GEMINI_API_KEY

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Credits
Built by Divyansh.

Powered by Google Gemini + Supabase.

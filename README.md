# LearnFlow AI

<!-- badges: start -->
![Vite](https://img.shields.io/badge/Vite-5A46FF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-0B0F14?logo=supabase&logoColor=3ECF8E)
![Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?logo=google&logoColor=white)
<!-- badges: end -->

Premium AI-powered study assistant built by Divyansh—turns your notes into interactive quizzes with detailed analytics.

> Notes → Quizzes → Insights → Better scores.

## What it does
- Turns study notes into interactive quizzes using Google Gemini.
- Tracks performance with analytics charts (Recharts).
- Includes Flashcards, Goals, History, and Results flows.
- Authentication + user data powered by Supabase.

## Tech stack
- React + TypeScript + Vite
- Routing: `react-router-dom` (HashRouter)
- State: Zustand
- UI/UX: Framer Motion, Lucide icons, `clsx` + `tailwind-merge`
- AI: `@google/genai` (Gemini)
- Files/PDF: `pdfjs-dist`
- Backend/Auth: `@supabase/supabase-js`

## App structure (routes)
Major pages/components:
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

Protected routes are gated behind auth (loading + redirect handled in `ProtectedRoute`).

## Run locally

### Prerequisites
- Node.js (LTS recommended)

### Install dependencies
```bash
npm install
Environment variables
Create .env.local in the project root.

bash
GEMINI_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
Start dev server
bash
npm run dev
Build & preview
Build:

bash
npm run build
Preview production build locally:

bash
npm run preview
Deployment
This is a standard Vite static build—deployable to Netlify/Vercel/Render.

Make sure these environment variables are set in your hosting dashboard:

GEMINI_API_KEY

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Credits
Built by Divyansh

Powered by Google Gemini + Supabase

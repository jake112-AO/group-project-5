# ScamShield Hub (Group 5)

Full-stack phishing detection training platform based on your course backlog and architecture docs.

## Implemented Architecture

- Frontend: React + React Router (multi-page SPA)
- Backend: Node.js + Express REST API
- Database: MongoDB with Mongoose models
- Auth: JWT + bcrypt password hashing
- Roles: `user` and `admin`
- Deployment target: Railway backend + static frontend

## Core Features

- Login / Register
- Email verification via Resend 6-digit code
- Home / Case Feed / Case Detail pages
- Voting flow (`scam` / `safe` / `unsure`) with instant explanation
- Points, level, accuracy, badge gamification
- User profile stats tracking
- Leaderboard ranking
- Case comments
- Admin dashboard (add, publish, unpublish, delete cases)
- Seed script creating 120 training cases

## Project Structure

- `src/` frontend app
- `backend/src/` Express API
- `backend/scripts/seedCases.js` dataset seeding

## Local Setup

1. Install dependencies:
   - Frontend: `npm install`
   - Backend: `npm --prefix backend install`
2. Configure env:
   - Frontend: copy `.env.example` to `.env`
   - Backend: copy `backend/.env.example` to `backend/.env`
3. Start backend: `npm run dev:backend`
4. Seed cases (once): `npm run seed`
5. Start frontend: `npm run dev`

## Backend Env

`backend/.env`:

- `PORT=4000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `CLIENT_ORIGIN=http://localhost:5173`
- `RESEND_API_KEY=...`
- `EMAIL_FROM=onboarding@resend.dev`

## Railway Deployment (Backend)

1. Push repo to GitHub.
2. In Railway, create a new project from this repo.
3. Set root directory to `backend`.
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_ORIGIN` (frontend domain)
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
5. Deploy using start command: `npm start`.
6. After deploy, set frontend `VITE_API_BASE_URL=https://<railway-domain>/api`.

## Suggested Demo Flow

1. Register a normal user and solve cases from Case Feed.
2. Show case explanations + comments.
3. Open Profile and Leaderboard to show score progression.
4. Login as admin account and manage cases from Admin Dashboard.

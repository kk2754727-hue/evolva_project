# Evolva Frontend

React + Vite frontend for the Evolva AI Career Optimization Engine. This is
step 1 of the build — a fully clickable UI wired with mock data, ready to be
pointed at the Python backend (`resume_analysis`, `Mock_interview`, etc.)
you already have in the repo.

## Stack

- React 18 + Vite 5
- React Router 6 (real routes: `/dashboard`, `/courses`, `/resume-analyzer`, ...)
- Tailwind CSS (utility classes only, no custom plugins)
- Recharts (dashboard chart)
- lucide-react (icons)

## Getting started

```bash
cd evolva-frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173** by default (same port your
screenshots show).

## Project structure

```
src/
  main.jsx              # React root, wraps App in BrowserRouter
  App.jsx                # Route table
  index.css              # Tailwind + global styles
  lib/theme.js            # Shared color tokens
  data/mock.js             # Mock data — swap for real API responses
  components/
    ui.jsx                 # RadialProgress, Toggle, Pill
    Sidebar.jsx              # App nav (also exports NAV config)
    Topbar.jsx                # Breadcrumb + search + user
  layouts/
    AppLayout.jsx              # Sidebar + Topbar + <Outlet/> shell
  pages/
    Landing.jsx                 # Marketing page ("/")
    Login.jsx                    # Sign-in ("/login")
    Dashboard.jsx                 # Stats, chart, skill overview
    Courses.jsx                    # Filterable course grid
    ResumeAnalyzer.jsx              # Upload + simulated ATS scoring
    SkillGap.jsx                     # Skill gap bars vs target
    MockInterview.jsx                 # Track picker + Q&A + summary
    Placement.jsx                      # Probability gauge + matches
    Recommendations.jsx                 # AI-generated next steps
    Notifications.jsx                    # Notification list
    Profile.jsx                           # Editable profile form
    Settings.jsx                           # Notification/security toggles
```

## Connecting to the real backend

Right now every "AI" result (resume score, interview feedback, skill gaps,
placement probability) is simulated in the frontend so the UI is fully
demoable without a server. Each spot that needs a real call is marked with
a `// TODO` comment, for example:

- `pages/ResumeAnalyzer.jsx` → `POST /api/resume/analyze` (multipart file
  upload) instead of the `setTimeout` fake analysis, mapping to your
  `resume_analysis/` module.
- `pages/MockInterview.jsx` → wire `submit()` to the `Mock_interview/`
  pipeline (`test_speech.py`, `test_timer.py`) instead of the random score.
- `pages/Login.jsx` → `POST /api/auth/login` instead of navigating straight
  to `/dashboard`.
- `data/mock.js` → replace static arrays with data fetched from your API
  (e.g. via `fetch` in a small `src/lib/api.js` you add later).

## Next steps

1. `npm install && npm run dev` to confirm the UI matches your screenshots.
2. Decide on the API contract (REST endpoints) your `resume_analyzer`,
   `Mock_interview`, and skill-scoring modules should expose.
3. Replace the `// TODO` spots one page at a time, starting with Resume
   Analyzer since that backend module looks the most built out already.

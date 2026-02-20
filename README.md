# Life Tracker v2 — With User Accounts + Cloud Database

Each user gets their own private data. PostgreSQL (Neon) cloud database.

## Setup (5 minutes)

### Step 1: Get a FREE Database
1. Go to **https://neon.tech** → Sign up (free)
2. Click **"New Project"** → name it "life-tracker"
3. Copy the **connection string** — it looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### Step 2: Configure Environment
```bash
cp .env.example .env
```
Open `.env` and paste your connection string:
```
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=type-any-random-long-string-here-abc123xyz
PORT=3001
```

### Step 3: Install & Run
```bash
npm install
npm start
```

### Step 4: Open
```
http://localhost:5173
```
Create an account → start tracking!

## How It Works Now

```
YOU (ali)                     YOUR FRIEND (sara)
    │                              │
    ▼                              ▼
┌─────────┐                  ┌──────────┐
│  Login   │                  │  Login   │
│ ali/pass │                  │ sara/pass│
└────┬─────┘                  └────┬─────┘
     │                              │
     ▼                              ▼
┌────────────────────────────────────────┐
│           YOUR SERVER                  │
│  "ali is asking" → WHERE user_id = 1  │
│  "sara asking"  → WHERE user_id = 2   │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│     PostgreSQL (Neon Cloud)            │
│                                        │
│  tasks:                                │
│  ┌────┬───────────┬─────────┐          │
│  │ id │ title     │ user_id │          │
│  ├────┼───────────┼─────────┤          │
│  │ 1  │ Buy milk  │ 2 (sara)│ ← sara  │
│  │ 2  │ Go to gym │ 1 (ali) │ ← ali   │
│  └────┴───────────┴─────────┘          │
│                                        │
│  Ali sees ONLY "Go to gym"             │
│  Sara sees ONLY "Buy milk"             │
└────────────────────────────────────────┘
```

## Deploy to Railway
1. Push to GitHub
2. railway.app → New Project → Deploy from GitHub
3. Add environment variables (DATABASE_URL, JWT_SECRET)
4. Build: `npm install && npm run build`
5. Start: `npm run production`
6. Generate Domain → Live!

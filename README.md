# Interactive Product Analytics Dashboard

Production-grade full stack application that tracks its own usage events and visualizes them in real-time analytics charts.

## Live Demo

- Frontend: https://product-analaysis.vercel.app/

## Core Concept

This dashboard is self-analytics driven.

- Every filter change and chart click triggers `POST /track`
- Tracked events are stored in PostgreSQL via Prisma
- Dashboard charts are generated from those same tracked events via `GET /analytics`

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS
- Recharts
- Axios
- React Router
- js-cookie

### Backend

- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt password hashing

## Project Structure

```txt
Product-analysis-dashboard/
  Backend/
    prisma/
      schema.prisma
    seed/
      seed.js
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      app.js
      server.js
    .env.example
    package.json

  Frontend/
    src/
      components/
      context/
      hooks/
      pages/
      services/
      App.jsx
      main.jsx
      index.css
    .env.example
    package.json

  README.md
```

## Database Schema

Defined in `Backend/prisma/schema.prisma`.

```prisma
enum Gender {
  Male
  Female
  Other
}

model User {
  id            Int            @id @default(autoincrement())
  username      String         @unique
  password      String
  age           Int
  gender        Gender
  featureClicks FeatureClick[]
  createdAt     DateTime       @default(now()) @map("created_at")

  @@map("users")
}

model FeatureClick {
  id          Int      @id @default(autoincrement())
  userId      Int      @map("user_id")
  featureName String   @map("feature_name")
  timestamp   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([featureName])
  @@index([timestamp])
  @@index([userId])
  @@map("feature_clicks")
}
```

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 2. Backend Setup

```bash
cd Backend
npm install
copy .env.example .env
```

Update `.env` values:

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

Run Prisma migrations and generate client:

```bash
npx prisma migrate dev --name init
```

Seed database with dummy data (users + tracked events):

```bash
npm run db:seed
```

Start backend:

```bash
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd Frontend
npm install
copy .env.example .env
```

Set API URL in `.env`:

- `VITE_API_URL=http://localhost:5000`

Start frontend:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

## API Documentation

Base URL: `http://localhost:5000`

### 1. Register User

`POST /register`

Request body:

```json
{
  "username": "alice",
  "password": "Password123!",
  "age": 27,
  "gender": "Female"
}
```

Response:

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "username": "alice",
    "age": 27,
    "gender": "Female"
  }
}
```

### 2. Login

`POST /login`

Request body:

```json
{
  "username": "alice",
  "password": "Password123!"
}
```

Response: same structure as register.

### 3. Track User Interaction

`POST /track`

Headers:

- `Authorization: Bearer <JWT_TOKEN>`

Request body:

```json
{
  "feature_name": "bar_chart_click"
}
```

Supported feature names (examples):

- `date_filter`
- `age_filter`
- `gender_filter`
- `bar_chart_click`
- `trend_chart_click`
- `gender_chart_click`
- `age_chart_click`
- `dashboard_open`

`feature_name` is validated server-side against this allowlist.

### 4. Get Analytics

`GET /analytics`

Headers:

- `Authorization: Bearer <JWT_TOKEN>`

Query params:

- `startDate` (ISO date or datetime)
- `endDate` (ISO date or datetime)
- `ageGroup`: `all` | `<18` | `18-40` | `>40`
- `gender`: `all` | `Male` | `Female` | `Other`
- `featureName` (optional selected feature for trend drilldown)
- `interval`: `auto` | `day` | `hour`

Response:

```json
{
  "filtersApplied": {
    "startDate": "2026-03-01T00:00:00.000Z",
    "endDate": "2026-03-31T23:59:59.999Z",
    "ageGroup": "18-40",
    "gender": "Female",
    "featureName": "bar_chart_click",
    "interval": "day"
  },
  "featureTotals": [
    {
      "featureName": "bar_chart_click",
      "clicks": 42
    }
  ],
  "timeSeries": [
    {
      "bucket": "2026-03-10",
      "clicks": 5
    }
  ]
}
```

## Frontend Behavior

### Authentication

- Login/Register screen
- JWT stored in localStorage
- Protected dashboard route

### Dashboard Features

- Glassmorphism UI with responsive layout
- Date range, age group, gender filters
- Filter selections persisted in cookies
- Recharts bar chart for feature totals
- Recharts line chart for time trend
- Bar click drill-down updates line chart
- Every filter change and chart click sends tracking event
- Debounced analytics API reads
- Loading skeletons + error/retry states
- Dark mode toggle

## Seed Script

Seed command:

```bash
cd Backend
npm run db:seed
```

What it inserts:

- 24 dummy users
- 100 feature click events
- Random ages, genders, timestamps, and features

## Architecture Explanation

The backend follows clean modular layers:

- `routes`: HTTP endpoint mapping
- `controllers`: request orchestration and response shaping
- `models`: data access and SQL aggregation logic
- `middleware`: auth and error handling
- `utils`: reusable helpers (JWT, validation, async wrappers, Prisma singleton)

The frontend follows scalable domain separation:

- `pages`: route-level views (`LoginPage`, `DashboardPage`)
- `components`: reusable UI and chart modules
- `services`: API clients and endpoint wrappers
- `context`: global auth state
- `hooks`: reusable stateful logic (debounce, cookies, theme)

## Deployment Steps

### Backend on Render or Railway

1. Create a PostgreSQL instance.
2. Deploy `Backend` as a Node service.
3. Set environment variables from `.env.example`.
4. Run migrations in deploy phase:
   - `npx prisma migrate deploy`
5. Start command:
   - `npm start`

### Frontend on Vercel or Netlify

1. Deploy `Frontend` project.
2. Build command:
   - `npm run build`
3. Output directory:
   - `dist`
4. Set environment variable:
   - `VITE_API_URL=<your-backend-url>`

## Short Essay: Scaling to 1 Million Write Events/Minute

If this dashboard needed to handle around 1 million write events per minute, I wouldn’t rely on direct synchronous database writes anymore because that would quickly become a bottleneck.
Instead, I’d move to an event-driven architecture. The API layer would stay lightweight—its job would be to quickly validate and authenticate incoming requests, and then push those events into a durable message queue like Kafka. This ensures the system can handle sudden spikes without slowing down.
From there, background consumers would process these events asynchronously and write them into databases optimized for analytics, such as ClickHouse or TimescaleDB. Meanwhile, PostgreSQL would be reserved strictly for transactional data like users and authentication, keeping it fast and reliable.
To make the dashboard responsive, I’d introduce real-time or near real-time aggregations using stream processing, so we’re not querying raw high-volume data every time. Frequently accessed or “hot” data would be cached in Redis, which significantly improves read performance.
I’d also separate concerns by having a dedicated query service for the dashboard. This way, data ingestion and data visualization can scale independently without affecting each other.
For reliability at scale, I’d add things like:

Partitioning to distribute load efficiently

Idempotency to avoid duplicate processing

Retries and dead-letter queues for failure handling

Autoscaling consumers based on load

Finally, I’d ensure strong observability—tracking metrics like latency, queue lag, and error rates, along with setting up alerts based on SLOs—so the system remains stable, fast, and reliable even under heavy traffic.
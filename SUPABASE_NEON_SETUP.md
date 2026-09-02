# 🚀 Supabase + Postgres (Neon) + OAuth Integration Checklist & Setup Guide

This guide provides step-by-step instructions for transitioning `umamusume-oshi-analyzer` from static file datasets to a production-ready **Supabase** or **Postgres (Neon)** database stack with **Google & Discord OAuth** authentication.

---

## 📋 Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Prerequisites & Accounts Checklist](#2-prerequisites--accounts-checklist)
3. [Database Schema Definition (Postgres / Neon / Supabase)](#3-database-schema-definition-postgres--neon--supabase)
4. [Supabase Setup & Authentication (Google & Discord)](#4-supabase-setup--authentication-google--discord)
5. [Environment Variables Configuration](#5-environment-variables-configuration)
6. [Connecting the Frontend Trainee Repository](#6-connecting-the-frontend-trainee-repository)

---

## 1. Architectural Overview

The application utilizes the **Repository Pattern** (`src/repositories/traineeRepository.ts`).

- **Current Mode**: `StaticTraineeRepository` loads local static TypeScript datasets (`src/data/trainees.ts`).
- **Target Mode**: `SupabaseTraineeRepository` / `NeonTraineeRepository` implements `ITraineeRepository` and fetches dynamic trainee data and user saved rosters via API routes or direct client SDK calls **without requiring any changes to React UI components**.

---

## 2. Prerequisites & Accounts Checklist

Prepare the following accounts and credentials before deployment:

- [ ] **Supabase Account**: [https://supabase.com](https://supabase.com) (For Auth + Database / Storage)
- [ ] **Neon Account** *(Optional if using Supabase Postgres)*: [https://neon.tech](https://neon.tech)
- [ ] **Google Cloud Console**: [https://console.cloud.google.com](https://console.cloud.google.com) (For Google OAuth Client ID & Secret)
- [ ] **Discord Developer Portal**: [https://discord.com/developers/applications](https://discord.com/developers/applications) (For Discord OAuth Client ID & Secret)
- [ ] **Vercel Account**: [https://vercel.com](https://vercel.com) (For CI/CD and deployment environment variables)

---

## 3. Database Schema Definition (Postgres / Neon / Supabase)

Run the following SQL migration script in your Supabase SQL Editor or Neon Database console:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Trainees Table
CREATE TABLE IF NOT EXISTS public.trainees (
    id VARCHAR(100) PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_jp VARCHAR(255) NOT NULL,
    rarity INTEGER NOT NULL CHECK (rarity BETWEEN 1 AND 3),
    surface JSONB NOT NULL,
    distance JSONB NOT NULL,
    style JSONB NOT NULL,
    portrait_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Saved Rosters Table
CREATE TABLE IF NOT EXISTS public.user_rosters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    roster_name VARCHAR(100) DEFAULT 'My Top 50',
    slots JSONB NOT NULL, -- Array of trainee IDs or slot objects
    weight_mode VARCHAR(20) DEFAULT 'tiered',
    filter_mode VARCHAR(20) DEFAULT 'aOnly',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on User Rosters
ALTER TABLE public.user_rosters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rosters"
    ON public.user_rosters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own rosters"
    ON public.user_rosters FOR ALL
    USING (auth.uid() = user_id);
```

---

## 4. Supabase Setup & Authentication (Google & Discord)

### A. Google OAuth Configuration
1. Go to **Google Cloud Console** > **APIs & Services** > **Credentials**.
2. Create an **OAuth 2.0 Client ID** (Web application).
3. Set Authorized Redirect URI:
   `https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback`
4. Copy `Client ID` and `Client Secret` to **Supabase Dashboard** > **Authentication** > **Providers** > **Google**.

### B. Discord OAuth Configuration
1. Go to **Discord Developer Portal** > **Applications** > **New Application**.
2. Under **OAuth2**, set Redirects:
   `https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback`
3. Copy `Client ID` and `Client Secret` to **Supabase Dashboard** > **Authentication** > **Providers** > **Discord**.

---

## 5. Environment Variables Configuration

Add the following environment variables to `.env.local` and your Vercel Project Settings:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional Direct Postgres / Neon Connection String
DATABASE_URL=postgresql://user:password@ep-cool-name.neon.tech/neondb?sslmode=require
```

---

## 6. Connecting the Frontend Trainee Repository

When ready to switch to Supabase data fetching:

1. Install `@supabase/supabase-js`:
   ```bash
   npm install @supabase/supabase-js
   ```
2. Create `src/repositories/supabaseTraineeRepository.ts` implementing `ITraineeRepository`.
3. In `src/repositories/traineeRepository.ts`, export `supabaseTraineeRepository` as `traineeRepository`.

All frontend components will automatically receive data from Supabase/Neon without any refactoring!

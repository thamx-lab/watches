---
name: mankind-watch-platform
description: >-
  Builds, configures, and deploys a Next.js 15 luxury watch platform with Tailwind CSS v4,
  Shadcn UI, Framer Motion, 6 unique watch collections, and n8n AI email automation integration.
---

# Mankind Watch Platform Skill

## Overview
This skill provides an automated, repeatable workflow for setting up a high-converting luxury watch showcase platform built on Next.js 15 App Router, Tailwind CSS v4, Shadcn UI components, and n8n AI email automation webhooks.

## Key Features & Architecture
- **Framework**: Next.js 15 (App Router, Static Export compatible).
- **Styling**: Tailwind CSS v4, Shadcn UI, Framer Motion animations.
- **Collections**: 6 distinct watch models (Classic 1920, Rose Gold Moonphase, Celestial Tourbillon, Obsidian Tactical, Submariner Deep Sea, Aviator GMT) with 100% unique specs, stories, and feature sets.
- **Interactive Modals**:
  1. `VIPConsultationModal`: Boutique appointment booking.
  2. `AIDossierModal`: Automated technical brochure dispatch.
  3. `CollectorClubSection`: n8n AI auction alert subscription.
  4. `WristSimulatorModal`: 3D wrist fit ratio calculator.
  5. `WatchComparatorModal`: Side-by-side technical spec comparison matrix.
- **AI Automation**: Express backend inquiry endpoint (`/api/inquiries`) forwarding payloads to n8n webhooks.

## Quick Start Command Sequence

```bash
# 1. Initialize Next.js project with App Router and TypeScript
npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes

# 2. Initialize Shadcn UI
npx -y shadcn@latest init -d

# 3. Install required UI & Icon dependencies
npm install framer-motion lucide-react

# 4. Configure static export in next.config.ts
# output: 'export', images: { unoptimized: true }

# 5. Build and verify static export
npm run build
```

## n8n Automation Setup
1. Define the webhook payload handler in `backend/src/controllers/inquiryController.ts`.
2. Configure `N8N_WEBHOOK_URL` in environment variables.
3. Handle fallback responses gracefully when the backend or n8n engine is offline.

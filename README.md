# Liquifi (tbc-liquifi-dev)

> **Standalone repo.** This app was migrated out of the TheBrainCord monorepo
> (`apps/liquifi`) into its own repo for independent development and
> deployment. TheBrainCord's repo links to this one for navigation.

Liquifi is a financial services platform offering balance transfer, CIBIL
score fixes, ITR filing, loan products, consultations, and an AI/WhatsApp
support chat — built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- Next.js 16 App Router + TypeScript + Tailwind CSS
- Supabase (Database/Auth)
- Anthropic Claude API (AI chat)
- WhatsApp Cloud API (bot + admin notifications)
- 2Factor (SMS OTP), Resend (email notifications), CallMeBot (WhatsApp notifications)

## Local Development

```bash
npm install
cp .env.example .env.local   # fill in your own keys
npm run dev
```

## CI/CD — How Deployment Works

This is a standalone repo — formerly developed inside the TheBrainCord
monorepo at `apps/liquifi`. It is now built and deployed independently.

- **Trigger:** Push to `main`
- **Workflow:** `.github/workflows/deploy.yml`
- **Build:** `vercel build --prod` with all env vars baked in via GitHub secrets
- **Deploy:** `vercel deploy --prebuilt --prod`

Required GitHub secrets:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPPORT_PHONE
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
TWOFACTOR_API_KEY
CALLMEBOT_WHATSAPP_API_KEY
WHATSAPP_NOTIFY_PHONE
RESEND_API_KEY
ADMIN_NOTIFY_EMAIL
CA_NOTIFY_EMAIL
ANTHROPIC_API_KEY
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_ACCESS_TOKEN
WHATSAPP_VERIFY_TOKEN
```

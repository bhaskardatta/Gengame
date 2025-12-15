# Deployment Guide (Vercel)

Your project is fully optimized for **Vercel**, which is the best free hosting platform for Next.js.
I have already pushed your latest code to GitHub (`https://github.com/bhaskardatta/Gengame`).

## Step 1: Create Project on Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/new).
2.  Click **"Import"** next to your repository `Gengame`.
3.  (If you don't see it, ensure your GitHub account is linked to Vercel).

## Step 2: Configure Project Settings (CRITICAL)
Since your app is in a subfolder, you **must** tell Vercel where to find it.

1.  In the Import flow (or Settings > General):
2.  Find **"Root Directory"**.
3.  Click **Edit** and select `phishnet-3d`.
4.  (The Framework Preset should automatically switch to Next.js).

## Step 3: Configure Environment Variables
**CRITICAL**: You must add your AI keys for the app to work online.

In the **"Environment Variables"** section of the deployment screen, add these:

| Name | Value |
|------|-------|
| `GROQ_API_KEY` | *(Paste your Groq Key here)* |
| `GEMINI_API_KEY` | *(Paste your Gemini Key here)* |

*(You can find these in your local `.env.local` file if you forgot them)*

## Step 3: Deploy
1.  Click **"Deploy"**.
2.  Wait ~1 minute.
3.  Your app will be live at `https://gengame.vercel.app` (or similar).

## Verification
-   Once live, open the URL.
-   Sit in the chair.
-   Click "Sync Mail" – if it generates an email, your **Groq API Key** is working correctly.

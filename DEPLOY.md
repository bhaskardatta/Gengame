# 🚀 Deployment Guide (Vercel)

To deploy **PhishNet 3D** successfully on Vercel without "processTicksAndRejections" errors, follow these steps exactly.

## 1. Environment Variables (CRITICAL)
The most common cause of build/runtime failures is a missing API Key.

1.  Go to your **Vercel Project Settings**.
2.  Click on **Environment Variables**.
3.  Add the following:
    *   **Key**: `GROQ_API_KEY`
    *   **Value**: `gsk_...` (Your actual Groq API Key)

> **Why?** The AI features (Guardian, Mail Generator) require this key to function. Without it, they will fallback to "Offline Mode" or fail.

## 2. Build Settings
Vercel should auto-detect Next.js, but verify:
*   **Framework Preset**: Next.js
*   **Build Command**: `next build` (or `npm run build`)
*   **Install Command**: `npm install`
*   **Output Directory**: `.next`

## 3. Troublshooting "processTicksAndRejections"
This error usually means an async operation (like an API call) failed ungracefully.
*   **Fix Applied**: We updated `src/lib/ai.ts` to be resilient. Even if your API Key is missing, the app will **NOT crash**. It will simply use a dummy key for the build process.
*   **Runtime**: If you see this error in Vercel Logs *during* gameplay, it means your `GROQ_API_KEY` is invalid or Quota Exceeded. The app will catch this and show a generic "Offline" message to the user instead of crashing.

## 4. Deploy
1.  Push the latest code: `git push origin main`
2.  Vercel will auto-deploy.

**Status**: ✅ Codebase is hardened for deployment.

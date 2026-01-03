<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1RWKdlTysvnZW0fWQUcqhZTIUGYjpPX74

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


Executive Overview (What Vercel does for you)

Vercel gives you:

Native Next.js optimization (zero config)
Global Edge Network (low latency everywhere)
Built-in CI/CD (auto-deploy on every push)
Serverless + Edge Functions
Free SSL, previews, rollbacks

This is not hosting — it’s deployment-as-a-service.

Option A — Recommended (GitHub → Vercel)

This is the industry standard workflow.

1️⃣ Prepare your Next.js app (locally)

Make sure your app runs cleanly:

npm install
npm run dev
npm run build


If npm run build fails, stop and fix first.

2️⃣ Push your project to GitHub

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main


Your repo is now deployment-ready.

3️⃣ Create a Vercel account

Go to vercel.com
Sign up using GitHub (strongly recommended)
This unlocks auto-deploy.

4️⃣ Import your project into Vercel

In Vercel Dashboard:

Click “New Project”
Select your GitHub repo
Vercel auto-detects Next.js
Leave defaults

Click Deploy 🚀

⏱️ Build time: ~1–2 minutes

5️⃣ You’re live

Vercel gives you:

https://your-project.vercel.app


Every git push → automatic redeploy.
No servers. No config. No stress.
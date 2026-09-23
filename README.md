<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/1a3c156c-9bdf-468b-991e-cdfd48464383

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Render

1. Push this project to GitHub.
2. In Render, choose **New > Blueprint** and select the repository.
3. Set `GEMINI_API_KEY` in the service environment variables.
4. Deploy. Render uses `render.yaml` automatically.

The health endpoint is available at `/health`.

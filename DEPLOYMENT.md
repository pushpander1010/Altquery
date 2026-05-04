# Deployment Guide

## Environment Variables

Only one environment variable is needed:

```
TOGETHER_API_KEY=your_together_api_key_here
```

Get your free API key from [Together AI](https://api.together.xyz/)

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. **IMPORTANT: Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add: `TOGETHER_API_KEY` = `your_actual_api_key`
   - Apply to: Production, Preview, Development
4. Redeploy (if already deployed)

## Deploy to Netlify

1. Push to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. **IMPORTANT: Add Environment Variable**
   - Go to Site Settings → Environment Variables
   - Add: `TOGETHER_API_KEY` = `your_actual_api_key`
6. Redeploy (if already deployed)

## Troubleshooting

### AI Assistant Shows "AI service not configured"
- Check that `TOGETHER_API_KEY` is added in your hosting platform
- Verify the API key is valid at [Together AI](https://api.together.xyz/)
- Redeploy after adding the environment variable

### AI Assistant Shows "AI service error"
- Check server logs in Vercel/Netlify dashboard
- Verify your Together AI account has credits
- Try a different model if LiquidAI/LFM2-24B-A2B is unavailable

## Deploy Anywhere Else

```bash
npm run build
npm start
```

Set `TOGETHER_API_KEY` environment variable before starting.

That's it!

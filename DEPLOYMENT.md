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
3. Add `TOGETHER_API_KEY` environment variable
4. Deploy

## Deploy to Netlify

1. Push to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add `TOGETHER_API_KEY` environment variable
6. Deploy

## Deploy Anywhere Else

```bash
npm run build
npm start
```

Set `TOGETHER_API_KEY` environment variable before starting.

That's it!

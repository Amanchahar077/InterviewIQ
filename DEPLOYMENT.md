# Deployment Checklist

## Frontend

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Node version: `20.19.0` or newer
- Required environment variables are listed in `client/.env.example`.

Set `VITE_SERVER_URL` to the deployed backend URL, without a trailing slash.

## Backend

- Root directory: `server`
- Start command: `npm start`
- Node version: `20.19.0` or newer
- Health check path: `/api/health`
- Required environment variables are listed in `server/.env.example`.

In production, set:

```env
NODE_ENV=production
CLIENT_URLS=https://your-deployed-frontend-url
```

`CLIENT_URLS` must exactly match the frontend origin because the app uses secure cookies for login.

## Firebase

Add the deployed frontend domain to Firebase Authentication authorized domains.

## Common Hosting Split

- Deploy `client` on Vercel or Netlify.
- Deploy `server` on Render, Railway, Fly, or another Node server host.
- Put the backend URL into the frontend `VITE_SERVER_URL`.
- Put the frontend URL into the backend `CLIENT_URLS`.

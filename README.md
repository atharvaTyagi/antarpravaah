# Antar Pravaah — Healing & Transformation

A modern, motion-forward website for a healing and transformation practice. The experience is designed as a guided journey with scroll-driven sections, card sequences, and testimonials.

## Tech Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **GSAP** (ScrollTrigger, Observer) for scroll-locking and step-based animations
- **Framer Motion** for reveal and motion primitives
- **Zustand** for lightweight state management
- **Sanity** for CMS (testimonials, thoughts)
- **Cloudinary** for images

---

## Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root with all required variables (see [Environment Variables](#environment-variables) below).

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

All environment variables listed below are **mandatory**. Create a `.env.local` file with these values before running the application.

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | [cloudinary.com/console](https://cloudinary.com/console) → Dashboard → Account Details |
| `CLOUDINARY_API_KEY` | Cloudinary API key | [cloudinary.com/console](https://cloudinary.com/console) → Dashboard → Account Details |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | [cloudinary.com/console](https://cloudinary.com/console) → Dashboard → Account Details |
| `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` | Deployed Google Apps Script Web App URL | Deploy your Apps Script as a web app; use the URL in format `https://script.google.com/macros/s/YOUR_ID/exec` |
| `NEXT_PUBLIC_GOOGLE_SCRIPT_TOKEN` | Shared secret token for authentication | Must match `SECRET_TOKEN` in your Apps Script (`Code.gs`). Generate with: `openssl rand -hex 32` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | [sanity.io/manage](https://sanity.io/manage) → Your Project → API |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name | Usually `production` |
| `SANITY_API_TOKEN` | Sanity API token (for server-side access) | [sanity.io/manage](https://sanity.io/manage) → Your Project → API → Tokens |

### Example `.env.local`

```env
# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Apps Script (booking form)
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
NEXT_PUBLIC_GOOGLE_SCRIPT_TOKEN=your-secret-token

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-token
```

---

## Production Build

### Build the project

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Run the production build locally

```bash
npm run start
```

The site will be available at [http://localhost:3000](http://localhost:3000) (or the port you configure).

---

## Deployment

### Prerequisites

- **Node.js** 18.x or newer
- All environment variables configured on the deployment server (or in your hosting platform’s environment settings)

### Steps

1. **Clone or upload** the project to the deployment server.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables** – Configure all required variables (see [Environment Variables](#environment-variables)) either as:
   - A `.env.local` or `.env.production` file, or
   - Environment variables in your hosting platform (Vercel, Netlify, etc.)

4. **Build the application:**
   ```bash
   npm run build
   ```

5. **Start the production server:**
   ```bash
   npm run start
   ```

6. **Recommended:** Use a process manager (e.g. PM2 or systemd) so the application restarts on failure.

### Default port

Next.js runs on port **3000** by default. To use another port:

```bash
PORT=8080 npm run start
```

---

## Post-Deployment: Sanity CORS

**Important:** After deploying the website, add your production URL as a CORS origin in Sanity.

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Open **API** → **CORS origins**
4. Add your deployed website URL (e.g. `https://yourdomain.com`)
5. Enable **Allow credentials** if your setup requires it

Without this step, Sanity API requests from the deployed site may be blocked.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run start` | Run production server (run after `npm run build`) |
| `npm run lint` | Run ESLint |

---

## Project Structure

- **`app/`** – Next.js App Router pages and layouts
- **`components/`** – Reusable UI components and animated sections
- **`lib/`** – Stores, theme config, utilities
- **`data/`** – Static content
- **`public/`** – Static assets (images, SVGs)
- **`sanity/`** – Sanity schema and configuration

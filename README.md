# AI Buddies - Premium Marketing Website

AI Buddies is a premium, futuristic single-page marketing website built for an AI Automation Agency. The interface is optimized for performance, accessibility (WCAG 2.2 AA), and high-quality interactivity.

---

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (with custom `@theme` directives in CSS)
- **3D Graphics**: Three.js, React Three Fiber (R3F), `@react-three/drei`
- **Animations**: Framer Motion
- **Icons**: Lucide React / Inline SVGs

---

## Directory Structure
```
aibuddies/
├── src/
│   ├── app/
│   │   ├── globals.css      # Core styles, glassmorphism panels, dark mode colors
│   │   ├── layout.tsx       # Root layout, custom font loader, custom cursor wrapper
│   │   └── page.tsx         # Page orchestrator containing all 13 sections in order
│   ├── components/
│   │   ├── ui/
│   │   │   ├── logo.tsx            # Sora wordmark logo (easily swappable)
│   │   │   ├── loader.tsx          #snappy 1-100% countdown load sequence gate
│   │   │   ├── navbar.tsx          # Center-pill glassmorphic header
│   │   │   ├── footer.tsx          # Contact, copyright, and social links
│   │   │   ├── custom-cursor.tsx   # Damped lag-ring custom cursor client code
│   │   │   └── corner-borders.tsx  # Decorative panel grids and L-brackets
│   │   └── sections/
│   │       ├── hero.tsx            # Hero presentation layouts
│   │       ├── hero-canvas.tsx     # 3D interactive Fibonacci particle sphere
│   │       ├── about.tsx           # Company story and 3 pillars
│   │       ├── services.tsx        # 5 Skill card grids
│   │       ├── solutions.tsx       # Full Stack AI bundle and SVG network hub
│   │       ├── process.tsx         # Step-by-step pipeline stages
│   │       ├── portfolio.tsx       # Client case study grids (6 clients only)
│   │       ├── why-us.tsx          # 5 edge highlights
│   │       ├── testimonials.tsx    # Slide-carousel client feedback cards
│   │       ├── faq.tsx             # Smooth height collapsible accordion FAQs
│   │       └── contact-form.tsx    # Indian & Intl WhatsApp validated form
│   └── config/
│       └── content.ts       # SINGLE configuration file containing all copy details
├── ANIMATION.md             # Spec documenting animation constants and physics
└── README.md                # Development & Vercel deployment logs
```

---

## Editing Content Sitewide
To update tags, client summaries, phone numbers, social links, FAQs, or testimonial copy, modify the corresponding entry inside the configuration file:
👉 **[src/config/content.ts](file:///Users/harshchouksey/Desktop/aibuddies/src/config/content.ts)**

All visible copy sits inside `BRAND_CONFIG`. Testimonials and FAQs contain clearly labeled placeholders for safe future overrides.

---

## Getting Started

### Prerequisites
Make sure you have Node.js 18.x+ and npm installed.

### Development Server
Run the local hot-reloaded development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Build Verification
To compile the codebase for production optimization:
```bash
npm run build
```
This runs TypeScript checking, lint checks, and bundles static page pages.

### Start Production Build
```bash
npm run start
```

---

## Deployment (Vercel)

This application is ready for Vercel deployment:
1. Log in to [Vercel](https://vercel.com).
2. Connect your Git repository (GitHub/GitLab).
3. The configuration will automatically detect Next.js settings.
4. Set the Build Command to `npm run build` and output directory as standard.
5. Click **Deploy**. Vercel will handle caching, asset delivery, and SSL certificates automatically.

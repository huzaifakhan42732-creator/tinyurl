# TinyURL - Simple & Fast URL Shortener

A modern, clean, and beginner-friendly URL Shortener web application built with **Next.js (App Router)**, **JavaScript**, **MongoDB**, **Mongoose**, and **Tailwind CSS**.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript
- **Database**: MongoDB (Atlas or Local)
- **ODM**: Mongoose
- **Icons**: `lucide-react`
- **Security**: `bcryptjs` (salted password hashing) & HTTP-only Session Cookies
- **Styling**: Tailwind CSS with subtle animations and responsive layouts

---

## 📁 Project Structure

```text
tinyurl/
│
├── app/
│   ├── [shortCode]/
│   │   └── page.js                # Dynamic route: redirects short code to original URL
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js       # User login & HTTP-only cookie setting
│   │   │   ├── logout/
│   │   │   │   └── route.js       # Clears session cookie
│   │   │   ├── me/
│   │   │   │   └── route.js       # Read-only user session checker for UI
│   │   │   └── signup/
│   │   │       └── route.js       # User registration with bcrypt hashing
│   │   │
│   │   ├── urls/
│   │   │   ├── create/
│   │   │   │   └── route.js       # Shorten long URL (requires authentication)
│   │   │   └── route.js           # GET user URLs & DELETE URL by ID
│   │   │
│   │   └── test-db/
│   │       └── route.js           # MongoDB connection verification route
│   │
│   ├── login/
│   │   └── page.js                # Polished login form
│   ├── signup/
│   │   └── page.js                # Registration form with confirm password check
│   ├── dashboard/
│   │   └── page.js                # Protected user dashboard (shortener & history)
│   ├── page.js                    # Modern landing page with interactive hero
│   ├── layout.js                  # Global application layout with ambient background
│   └── globals.css                # Tailwind CSS & keyframe animations
│
├── components/
│   ├── Navbar.js                  # Responsive header with live auth state
│   ├── Footer.js                  # Clean footer
│   ├── Background.js              # Subtle animated gradient background & dot grid
│   ├── UrlForm.js                 # Reusable URL shortening form
│   └── Loading.js                 # Spinner / loading placeholder
│
├── lib/
│   ├── db.js                      # Auto-reconnecting, cached Mongoose connection
│   └── auth.js                    # Server helper to read HTTP-only session cookie
│
├── models/
│   ├── User.js                    # Mongoose User Schema (name, unique email, hashed password)
│   └── Url.js                     # Mongoose Url Schema (originalUrl, shortCode, user ref)
│
├── public/                        # Static assets
├── .env                           # Environment variables (MONGODB_URI)
├── .env.local                     # Local environment overrides
├── .gitignore                     # Git ignore rules
├── jsconfig.json                  # Path aliases (@/*)
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies & scripts
└── README.md                      # Project documentation
```

---

## ⚙️ Getting Started

### 1. Configure MongoDB

Ensure your connection string is defined in `.env` or `.env.local`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tinyurl?retryWrites=true&w=majority
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 Application Flow

1. **Landing Page (`/`)**:
   - Features a clean hero header, interactive URL shortener, feature overview, and a 3-step guide on how it works.
2. **Authentication (`/signup` & `/login`)**:
   - Register a new account with email validation and passwords securely hashed with `bcryptjs`.
   - Log in to receive a secure, HTTP-only session cookie.
3. **Dashboard (`/dashboard`)**:
   - Protected route for authenticated users.
   - Enter long links to generate random 6-character short links.
   - Click **Copy** for instant clipboard copy with visual feedback.
   - View your link history and delete URLs with confirmation.
4. **Link Redirection (`/[shortCode]`)**:
   - Visiting any shortened link looks up the short code in MongoDB and redirects (HTTP 307) immediately to the original destination URL.
   - Non-existent codes display a friendly, polished "Link Not Found" page.

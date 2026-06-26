<!-- Banner Image Badge -->
<div align="center">
  <img src="https://img.shields.io/badge/ArtHall-Marketplace-D4AF37?style=for-the-badge" alt="ArtHall Logo" />
  
  # 🏛️ ArtHall — Premium Art Gallery & Marketplace

  [![Next.js Version](https://img.shields.io/badge/Next.js-16.2.9-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React Version](https://img.shields.io/badge/React-19.2.4-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Stripe Integration](https://img.shields.io/badge/Payments-Stripe-635BFF?style=flat-square&logo=stripe)](https://stripe.com/)
  [![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-red?style=flat-square)](https://better-auth.com/)
  [![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
  [![Deployment](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)

  **A modern digital art gallery and marketplace platform that connects global creators with art enthusiasts.**
  
  [🌐 Live Site Demo](https://b13-assingment-10-client.vercel.app) • [🖥️ Client Repository](https://github.com/khalid66527/B13-Assignment-10-Client.git) • [⚙️ Server Repository](https://github.com/khalid66527/B13-Assignment-10-Server.git)
</div>

---

## 📖 Project Purpose
**ArtHall** is designed to digitize the fine arts ecosystem. It bridges the gap between independent artists seeking exposure and collectors looking to acquire unique masterpieces. 

Whether you are:
- A **Buyer** looking to discover, buy, and collect high-quality digital and physical artworks.
- An **Artist** trying to upload, exhibit, track, and sell your creations with detailed analytics.
- An **Administrator** managing users, vetting content, tracking payments, and auditing the platform.

ArtHall provides a cohesive, premium-tier, fully-responsive dashboard and gallery experience powered by modern technology.

---

## ✨ Key Features
The system supports three user roles, each with custom workflows and dedicated dashboards:

### 👤 Buyer (User) Flow
- **Exquisite Art Gallery**: Search and filter paintings by categories, artist names, or price ranges.
- **Subscription Upgrades**: Choose from **Free**, **Pro**, or **Premium** tier buying plans to unlock purchase capacity.
- **Stripe Payments**: Safe, secure checkouts via Stripe.
- **My Collection**: Dashboard to track bought artworks and access download paths.
- **Purchase History**: Complete log of all financial transactions.

### 🎨 Artist Flow
- **Exhibition Suite**: Easily publish new artworks with image uploading via ImageBB API.
- **Art Management**: Edit details, set prices, and list/unlist paintings.
- **Artist Dashboard**: Monitor total earnings, best-selling art, and monthly statistics.
- **Role Restrictions**: System level validation prevents artists from purchasing artworks to prevent conflict of interest.

### 🛡️ Admin Suite
- **Artwork Curation**: Review, approve, reject, or archive artwork listings.
- **User Directory**: View, search, update user roles, and activate/deactivate accounts.
- **Transaction Ledger**: Access comprehensive logs of all direct purchases and subscription charges.
- **Business Intelligence**: Analytics dashboards complete with charts showing overall growth, user counts, and platform earnings.

---

## 🛠️ Tech Stack & Packages Used
The application is built on a highly-performant modern stack:

### Frontend Core & UI
- **Next.js 16 (App Router)**: Framework for optimal performance and SEO structure.
- **React 19 & React-DOM 19**: Responsive component UI model.
- **HeroUI (`@heroui/react` & `@heroui/styles`)**: Rebranded premium UI component library with elegant visual animations.
- **Tailwind CSS v4**: PostCSS integration for modern styling utilities.

### Auth, Database & Payments
- **Better Auth (`better-auth` & `@better-auth/mongo-adapter`)**: Robust session security supporting Google OAuth and credential-based logins.
- **Stripe SDK (`stripe` & `@stripe/stripe-js`)**: End-to-end checkout session management.
- **MongoDB (`mongodb`)**: Fast database storage for application states, transactions, and user profiles.

### Utilities & Iconography
- **Icon Packages**: `@iconify/react`, `@gravity-ui/icons`, and `react-icons` for rich, interactive layouts.

---

## 💻 Local Installation & Setup

Follow these steps to run the client-side server locally:

### 1. Clone the repository
```bash
git clone https://github.com/khalid66527/B13-Assignment-10-Client.git
cd B13-Assignment-10-Client
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root folder and add the following keys:
```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=your_mongodb_connection_uri
AUTH_DB_NAME=b13_assignment_10_db

# Image Upload
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key

# Backend Server Url
NEXT_PUBLIC_URL=your_backend_server_url

# Google Client Auth (OAuth 2.0)
GOOGLE_AUTH_CLIENT_ID=your_google_client_id
GOOGLE_AUTH_CLIENT_SECRET=your_google_client_secret

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Key Directory Structure
```text
├── src/
│   ├── app/
│   │   ├── about/            # About Page
│   │   ├── api/              # Route handlers (checkout, etc.)
│   │   ├── auth/             # Sign-in & Sign-up routes
│   │   ├── dashboard/        # Role-based subfolders (admin, artist, user)
│   │   ├── plans/            # Subscription plans & Success page
│   │   ├── shop/             # Artwork search & Stripe BuyNow page
│   │   ├── team/             # Team & featured artists list
│   │   ├── components/       # Global & dashboard specific components
│   │   ├── globals.css       # Core Tailwind CSS configuration
│   │   └── layout.js         # Base viewport wrapper
│   └── lib/
│       ├── actions/          # Backend/Database mutations
│       └── auth-client.js    # Better Auth client initialization
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.


# Odhiyaty (أضحيتي) - Sheep/Sacrificial Animal E-commerce Platform

## Overview
Odhiyaty is an Arabic e-commerce platform for selling sheep and sacrificial animals. The platform features a modern frontend with product browsing capabilities and a backend API for managing products, orders, and authentication.

## Project Structure
```
.
├── backend/
│   ├── db/
│   │   ├── drizzle.js          # Database configuration (PostgreSQL)
│   │   ├── schema.sql          # Database schema definition
│   │   └── init.js             # Database initialization script
│   ├── routes/
│   │   ├── auth.js             # Firebase authentication routes
│   │   ├── products.js         # Product API routes (connected to DB)
│   │   └── orders.js           # Order management routes (connected to DB)
│   └── server.js               # Express backend server (port 3000)
├── public/
│   ├── index.html              # Main homepage
│   ├── products.html           # Products listing page
│   ├── auth.html               # Login/Register page with Firebase
│   ├── styles.css              # Global stylesheet
│   ├── main.js                 # Homepage JavaScript
│   ├── products.js             # Products page JavaScript
│   └── logo.png                # Website logo
├── frontend-server.js          # Frontend server with API proxy (port 5000)
├── start.js                    # Startup script for both servers
└── package.json                # Project dependencies
```

## Recent Changes (November 2025)
- **Project Import**: Successfully imported and configured for Replit environment
- **Dual Server Setup**: Configured backend (port 3000) and frontend (port 5000) servers
- **API Proxy**: Frontend server now proxies API requests to backend for seamless integration
- **Mock Data**: Implemented mock data for products and orders (database-ready structure)
- **Firebase Auth**: Configured optional Firebase authentication with graceful fallback
- **Cache Control**: Added proper cache headers to prevent stale content in Replit iframe
- **Complete Redesign**: Modern, professional Arabic interface with:
  - New logo integration from user's design (80px height)
  - Full sections: Hero, Features, Products, About, How It Works, Testimonials, Contact
  - Responsive mobile menu with proper CSS fixes
  - Smooth scroll animations and transitions
  - Golden gradient color scheme (#D4AF37)
  - Interactive product cards with dynamic loading
  - Contact form with proper field names for backend integration
  - Professional footer with social links
- **Multi-Page Structure** (Latest):
  - Separated pages for better navigation
  - Homepage (index.html) with all sections
  - Dedicated products page (products.html) with category filters
  - Complete authentication page (auth.html) with Firebase integration
- **Database Integration**:
  - PostgreSQL database connected and initialized
  - Real database tables: sheep, orders, admins
  - Sample data inserted for testing
  - Full CRUD operations in API routes
- **Firebase Authentication**:
  - Login and registration forms
  - Password reset functionality
  - Token-based authentication with backend verification

## Architecture

### Frontend
- Pure HTML/CSS/JavaScript
- Arabic RTL (right-to-left) interface
- Served via Express.js on port 5000 (0.0.0.0)
- API proxy built-in for backend communication

### Backend
- Express.js REST API on port 3000 (localhost)
- Routes: `/api/products`, `/api/orders`, `/api/auth`
- CORS enabled for cross-origin requests
- Currently using mock data (ready for PostgreSQL integration)

### Database
- PostgreSQL with direct pg connection
- Connection string configured in backend/db/drizzle.js
- Three main tables:
  - **sheep**: Products with categories, prices, discounts, weight, age, breed
  - **orders**: Customer orders with products, status tracking
  - **admins**: Firebase-authenticated admin users
- Database initialization: `npm run db:init`
- Includes sample data for testing

## Environment Variables

### Required
- `DATABASE_URL`: PostgreSQL connection string (currently configured in code)
  - Format: `postgresql://user:password@host:port/database`

### Optional  
- `FIREBASE_SERVICE_ACCOUNT`: JSON string for Firebase Admin SDK (for backend token verification)
- `BACKEND_PORT`: Backend server port (default: 3000)

### Firebase Configuration (Frontend)
You need to add your Firebase config in `public/auth.html`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Running the Application

### Development
```bash
npm start
```
This starts both frontend (port 5000) and backend (port 3000) servers.

### Individual Servers
```bash
npm run frontend  # Frontend only
npm run backend   # Backend only
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (sheep)
- Response includes: id, name, price, weight, image, description

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
  - Body: `{ user_name, phone, state, city, products, total, notes }`
- `PATCH /api/orders/:id/status` - Update order status
  - Body: `{ status }`

### Authentication
- `POST /api/auth/login` - Login with Firebase token
  - Body: `{ token }`
  - Returns: `{ uid, email, message }`

## User Preferences
- Language: Arabic (RTL)
- Framework: Vanilla JavaScript with Express.js backend
- Database: PostgreSQL with Drizzle ORM (configured but not yet connected)

## Deployment Notes
- Frontend must run on port 5000 (Replit webview requirement)
- Backend runs on localhost:3000 (internal only)
- API calls proxied through frontend server
- Cache disabled to ensure updates are visible in Replit iframe

## Next Steps
1. Connect to PostgreSQL database (set `DATABASE_URL` environment variable)
2. Create database schema with Drizzle migrations
3. Replace mock data with real database queries
4. Set up Firebase authentication (set `FIREBASE_SERVICE_ACCOUNT` if needed)
5. Add product images and enhance UI
6. Implement order management dashboard

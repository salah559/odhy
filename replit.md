# Odhiyaty (أضحيتي) - Sheep/Sacrificial Animal E-commerce Platform

## Overview
Odhiyaty is an Arabic e-commerce platform for selling sheep and sacrificial animals. The platform features a modern frontend with product browsing capabilities and a backend API for managing products, orders, and authentication.

## Project Structure
```
.
├── backend/
│   ├── db/
│   │   └── drizzle.js          # Database configuration (Drizzle ORM with PostgreSQL)
│   ├── routes/
│   │   ├── auth.js             # Firebase authentication routes
│   │   ├── products.js         # Product API routes
│   │   └── orders.js           # Order management routes
│   └── server.js               # Express backend server (port 3000)
├── frontend-server.js          # Frontend server with API proxy (port 5000)
├── start.js                    # Startup script for both servers
├── index.html                  # Main HTML page
├── styles.css                  # Stylesheet
├── main.js                     # Frontend JavaScript
└── package.json                # Project dependencies
```

## Recent Changes (November 2025)
- **Project Import**: Successfully imported and configured for Replit environment
- **Dual Server Setup**: Configured backend (port 3000) and frontend (port 5000) servers
- **API Proxy**: Frontend server now proxies API requests to backend for seamless integration
- **Mock Data**: Implemented mock data for products and orders (database-ready structure)
- **Firebase Auth**: Configured optional Firebase authentication with graceful fallback
- **Cache Control**: Added proper cache headers to prevent stale content in Replit iframe
- **Complete Redesign** (Latest): Modern, professional Arabic interface with:
  - New logo integration from user's design
  - Full sections: Hero, Features, Products, About, How It Works, Testimonials, Contact
  - Responsive mobile menu with proper CSS fixes
  - Smooth scroll animations and transitions
  - Golden gradient color scheme (#D4AF37)
  - Interactive product cards with dynamic loading
  - Contact form with proper field names for backend integration
  - Professional footer with social links

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
- Configured for PostgreSQL with Drizzle ORM
- Environment variable: `DATABASE_URL`
- Currently using in-memory mock data
- Schema ready for: products (sheep), orders, users

## Environment Variables

### Required
None currently (using mock data)

### Optional
- `DATABASE_URL`: PostgreSQL connection string for production database
- `FIREBASE_SERVICE_ACCOUNT`: JSON string for Firebase Admin SDK (for authentication)
- `BACKEND_PORT`: Backend server port (default: 3000)

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

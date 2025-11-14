# Firebase Setup Guide for Odhiyaty

This guide explains how to set up Firebase Authentication for the Odhiyaty platform.

## Important Notes

- **Firebase Frontend Config is NOT Secret**: The Firebase configuration object (apiKey, authDomain, etc.) used in the frontend is public information and is meant to be exposed. It identifies your Firebase project but doesn't grant any permissions on its own.
  
- **Firebase Service Account IS Secret**: The Firebase Admin SDK service account JSON file is highly sensitive and should NEVER be exposed in frontend code or committed to version control.

- **Firebase is Optional for Basic Usage**: The platform works without Firebase for public features (browsing products, creating orders). However, **Firebase is REQUIRED for admin features** (viewing all orders, updating order status). Without Firebase setup, protected admin routes will return 503 Service Unavailable.

## Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or select existing project
3. Enable Authentication > Sign-in method > Email/Password

### 2. Get Frontend Configuration

1. In Firebase Console, go to Project Settings (⚙️ icon)
2. Scroll to "Your apps" section
3. Click "Web" (</> icon) to add a web app
4. Copy the `firebaseConfig` object
5. Replace the placeholder config in `public/auth.html`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Get Backend Service Account (Optional - for Admin Features)

**Note**: This is ONLY needed if you want to verify users on the backend or use admin features.

1. In Firebase Console, go to Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. In Replit, add this as a secret:
   - Secret name: `FIREBASE_SERVICE_ACCOUNT`
   - Secret value: Paste the entire JSON content (as a single-line string)

### 4. Test Authentication

1. Open your deployed site
2. Go to `/auth.html`
3. Try registering a new account
4. Try logging in with the registered account

## Features

### Currently Implemented

- ✅ User Registration (Email/Password)
- ✅ User Login (Email/Password)
- ✅ Password Reset
- ✅ Frontend Token Management
- ✅ Backend Token Verification (optional, requires service account)
- ✅ Admin User Creation in Database

### Future Enhancements

- Protected admin routes
- User profile management
- Social login providers (Google, Facebook, etc.)
- Email verification
- Two-factor authentication

## API Endpoints

### POST `/api/auth/verify`
Verifies a Firebase ID token and checks if user is admin.

**Authentication**: Not required (verifies token in request body)

**Request Body:**
```json
{
  "token": "firebase_id_token"
}
```

**Response:**
```json
{
  "uid": "user_firebase_uid",
  "email": "user@example.com",
  "isAdmin": true,
  "message": "تم التحقق من التوكن بنجاح"
}
```

### POST `/api/auth/create-admin`
Creates the FIRST admin record in the database. **Protected by ADMIN_CREATION_SECRET**.

**Security**: Only works when no admins exist. Requires `ADMIN_CREATION_SECRET` environment variable.

**Request Body:**
```json
{
  "token": "firebase_id_token",
  "email": "admin@example.com",
  "name": "Admin Name",
  "adminSecret": "YOUR_ADMIN_CREATION_SECRET"
}
```

**Response (Success):**
```json
{
  "message": "تم إنشاء حساب المسؤول بنجاح",
  "admin": {
    "id": 1,
    "firebase_uid": "...",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

**Response (Already Have Admins):**
```json
{
  "error": "غير مصرح",
  "message": "لإنشاء مسؤولين جدد، يجب استخدام حساب مسؤول موجود"
}
```

**Response (Invalid Secret):**
```json
{
  "error": "غير مصرح",
  "message": "لإنشاء أول مسؤول، يجب تقديم ADMIN_CREATION_SECRET الصحيح"
}
```

### POST `/api/admin/add-admin`
Add new admin user (requires existing admin authentication).

**Authentication**: Required - `Authorization: Bearer <firebase_id_token>`

**Authorization**: User must be existing admin

**Request Body:**
```json
{
  "firebase_uid": "target_user_firebase_uid",
  "email": "newadmin@example.com",
  "name": "New Admin Name"
}
```

**Response:**
```json
{
  "message": "تم إضافة المسؤول بنجاح",
  "admin": {...}
}
```

### GET `/api/admin/admins`
Get list of all admins (requires admin authentication).

**Authentication**: Required - `Authorization: Bearer <firebase_id_token>`

**Authorization**: User must be admin

### DELETE `/api/admin/admins/:id`
Delete an admin (requires admin authentication). Cannot delete last admin.

**Authentication**: Required - `Authorization: Bearer <firebase_id_token>`

**Authorization**: User must be admin

## Protected Endpoints (Admin Only)

The following endpoints require:
1. Valid Firebase authentication token in Authorization header
2. User must be registered as admin in the database (via `/api/auth/create-admin`)

**Authentication Process:**
1. User logs in via Firebase (gets ID token)
2. User creates admin account via POST `/api/auth/create-admin` with token
3. User can now access protected routes with same token

**Authorization Levels:**
- ✅ Valid token from correct project + User in admins table = **Access Granted**
- ❌ Valid token from correct project + User NOT in admins table = **403 Forbidden**
- ❌ Valid token from different Firebase project = **401 Unauthorized**
- ❌ Invalid/missing token = **401 Unauthorized**

**Security Note**: The backend implements multiple token validation checks:
1. **Audience Validation**: Verifies `aud` claim matches the configured project ID
2. **Issuer Validation**: Verifies `iss` claim is `https://securetoken.google.com/<projectId>`
3. **Signature Validation**: Verifies token signature using Firebase public keys
4. **Revocation Check**: Checks if token has been revoked (`checkRevoked=true`)

This multi-layer validation prevents:
- Cross-project token attacks
- Forged tokens with matching audience but wrong issuer
- Use of revoked/compromised tokens
- Token replay attacks from other Firebase projects

### GET `/api/orders`
Get all orders.

**Authentication**: Required - `Authorization: Bearer <firebase_id_token>`

**Authorization**: User must be registered admin

**Response**: Array of all orders

### GET `/api/orders/:id`
Get specific order by ID.

**Authentication**: Required - `Authorization: Bearer <firebase_id_token>`

**Authorization**: User must be registered admin

**Response**: Single order object

### PATCH `/api/orders/:id/status`
Update order status.

**Authentication**: Required - `Authorization: Bearer <firebase_id_token>`

**Authorization**: User must be registered admin

**Request Body:**
```json
{
  "status": "قيد المعالجة"
}
```

**Response**: Updated order object

### Public Endpoints (No Authentication Required)

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/orders` - Create new order

## Security Best Practices

1. ✅ Never commit Firebase service account JSON to git
2. ✅ Store service account in environment variables/secrets
3. ✅ Frontend config is public and safe to expose
4. ✅ Always verify tokens on backend for sensitive operations
5. ✅ Use HTTPS in production (Replit deployments use HTTPS by default)
6. ✅ **Project ID Validation**: Backend verifies tokens belong to the configured Firebase project
   - Validates token's `aud` (audience) claim matches project ID
   - Validates token's `iss` (issuer) claim is `https://securetoken.google.com/<projectId>`
   - Prevents cross-project and forged token attacks
   - Project ID is extracted from service account and validated on every request
7. ✅ **Strict Token Verification**: Uses `verifyIdToken(token, true)` with checkRevoked flag
8. ✅ **Secure Error Handling**: Error responses contain minimal information
   - Detailed errors logged server-side only
   - Generic error messages returned to clients
   - Prevents information leakage to potential attackers
8. ⚠️ Add rate limiting for authentication endpoints (future enhancement)
9. ⚠️ Implement proper session management (future enhancement)

## Troubleshooting

### "Firebase is not configured" Error (Frontend)
**Solution**: 
- Make sure you've replaced the placeholder config in `auth.html`
- Check browser console for detailed error messages
- Get your Firebase config from Firebase Console > Project Settings

### "503 Service Unavailable" on Protected Routes
**Problem**: When calling protected admin routes (GET /orders, PATCH /orders/:id/status), you get:
```json
{
  "error": "خدمة المصادقة غير متاحة",
  "details": "يرجى إعداد Firebase من خلال تعيين FIREBASE_SERVICE_ACCOUNT في المتغيرات البيئية..."
}
```

**Solution**: 
1. This means Firebase Admin SDK is not configured on the backend
2. Add `FIREBASE_SERVICE_ACCOUNT` secret in Replit (see step 3 above)
3. Restart the application after adding the secret
4. **This is REQUIRED for admin features** - there is no workaround

### Users Can't Register/Login (Frontend)
**Solution**:
- Verify Email/Password authentication is enabled in Firebase Console
- Check browser console for Firebase error messages
- Ensure your domain is authorized in Firebase Console
- Make sure you replaced placeholder config in auth.html

## What Works Without Firebase

✅ **Public Features (No Firebase Needed)**:
- Browse homepage (/)
- View products page (/products.html)
- Filter products by category
- Create orders (POST /api/orders)
- Get product listings (GET /api/products)

❌ **Admin Features (Firebase REQUIRED)**:
- User login/registration (/auth.html)
- View all orders (GET /api/orders)
- View specific order (GET /api/orders/:id)
- Update order status (PATCH /api/orders/:id/status)
- Admin user management

## Production Deployment Checklist

Before deploying to production:

1. ✅ Set up Firebase project
2. ✅ Add Firebase config to auth.html
3. ✅ Add FIREBASE_SERVICE_ACCOUNT secret in deployment environment
4. ✅ Enable Email/Password auth in Firebase Console
5. ✅ Test login/registration flows
6. ✅ Create at least one admin user via /api/auth/create-admin
7. ✅ Test protected routes with valid token
8. ✅ Verify database connection works
9. ✅ Test on mobile devices for responsive design
10. ✅ Review security rules in Firebase Console

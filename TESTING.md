# Testing Guide for Odhiyaty Platform

This guide provides instructions for testing the platform functionality.

## Testing Without Firebase

The platform can be tested and used without Firebase setup:

### 1. Products Page (No Auth Required)
- Navigate to `/products.html`
- Should display all products from database
- Test category filters (الكل، محلي، روماني، إسباني)
- Product cards should show price, weight, age, breed
- Verify discounts are calculated correctly

### 2. Creating Orders (No Auth Required)
- POST to `/api/orders`
- Example request:
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "أحمد محمد",
    "phone": "0555123456",
    "state": "الجزائر",
    "city": "الجزائر العاصمة",
    "products": [{"id": 1, "name": "خروف روماني", "quantity": 1}],
    "total": 55000,
    "notes": "توصيل سريع من فضلك"
  }'
```

## Testing With Firebase

### Prerequisites
1. Complete Firebase setup (see FIREBASE_SETUP.md)
2. Add `FIREBASE_SERVICE_ACCOUNT` secret in Replit
3. Replace Firebase config in `public/auth.html`

### 1. User Registration & Login
1. Navigate to `/auth.html`
2. Click "إنشاء حساب جديد"
3. Enter email and password (min 6 characters)
4. Should see success message and redirect

**Expected Result**: User created in Firebase, can login with credentials

### 2. Admin User Creation
After logging in, create admin user in database:

```bash
# Get user's ID token from browser console after login
# Then call create-admin endpoint:
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_FIREBASE_ID_TOKEN",
    "name": "Admin User"
  }'
```

**Expected Result**: Admin record created in database

### 3. Token Verification
Test the verify endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_FIREBASE_ID_TOKEN"
  }'
```

**Expected Response**:
```json
{
  "uid": "firebase_user_id",
  "email": "user@example.com",
  "isAdmin": true,
  "message": "تم التحقق من التوكن بنجاح"
}
```

### 4. Protected Routes (Admin Only)

**IMPORTANT**: Before testing protected routes, you MUST create an admin user first using `/api/auth/create-admin` endpoint.

#### Create Admin User (First Time Only)
```bash
# After logging in, use your ID token to create admin account
curl -X POST http://localhost:3000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_FIREBASE_ID_TOKEN",
    "name": "Admin User"
  }'
```

**Expected Response**:
```json
{
  "message": "تم إنشاء حساب المسؤول بنجاح",
  "admin": {"id": 1, "firebase_uid": "...", "email": "...", "name": "Admin User"}
}
```

#### Get All Orders (Admin Only)
```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

#### Get Single Order (Admin Only)
```bash
curl http://localhost:3000/api/orders/1 \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
```

#### Update Order Status (Admin Only)
```bash
curl -X PATCH http://localhost:3000/api/orders/1/status \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "قيد المعالجة"}'
```

**Expected Behavior**:
- ✅ With valid admin token: Returns data
- ❌ Without token: Returns 401 Unauthorized  
- ❌ With invalid token: Returns 401 Unauthorized
- ❌ With valid token but NOT admin: Returns 403 Forbidden

### 5. Testing Admin Authorization

#### Test with Non-Admin User
1. Create a new Firebase user (different from admin)
2. Login with this user to get token
3. Try to access protected route:

```bash
curl http://localhost:3000/api/orders \
  -H "Authorization: Bearer NON_ADMIN_TOKEN"
```

**Expected Response** (403 Forbidden):
```json
{
  "error": "غير مصرح",
  "details": "هذا المسار متاح فقط للمسؤولين. يجب أن يكون حسابك مسجلاً كمسؤول في النظام."
}
```

#### Test with Admin User
1. Use admin user's token
2. Should successfully access all protected routes

## Database Testing

### 1. Verify Database Connection
```bash
npm run db:init
```

**Expected**: Tables created successfully

### 2. Check Sample Data
```bash
# Using psql or database tool:
SELECT * FROM sheep;
SELECT * FROM orders;
SELECT * FROM admins;
```

**Expected**: Sample products and orders exist

## Frontend Testing

### 1. Homepage
- Navigate to `/`
- Verify all sections load (Hero, Features, Products, About, etc.)
- Test navigation menu
- Mobile menu should work on small screens

### 2. Products Page
- Filter buttons should change active state
- Products should load from database
- Discount calculations should be correct

### 3. Auth Page (with Firebase)
- Login form validation
- Registration form validation
- Password reset functionality
- Error messages display correctly

## Common Issues

### Issue: "Firebase is not configured"
**Solution**: Add Firebase config in auth.html or add FIREBASE_SERVICE_ACCOUNT secret

### Issue: Products not loading
**Solution**: 
1. Check backend is running: `curl http://localhost:3000/api/products`
2. Verify database connection
3. Check browser console for errors

### Issue: 401 on protected routes
**Solution**: 
1. Verify you're passing Authorization header
2. Check token is valid (not expired)
3. Ensure FIREBASE_SERVICE_ACCOUNT is set

## Manual Testing Checklist

- [ ] Homepage loads with all sections
- [ ] Products page displays products from database
- [ ] Category filters work correctly
- [ ] Mobile menu toggles properly
- [ ] Order creation (POST /api/orders) works
- [ ] Firebase login works (if configured)
- [ ] Firebase registration works (if configured)
- [ ] Admin creation works (if configured)
- [ ] Protected routes reject unauthenticated requests
- [ ] Protected routes accept valid tokens
- [ ] Database queries execute successfully
- [ ] Responsive design works on mobile

## Notes

- **Public Routes**: Products listing, order creation
- **Protected Routes**: Viewing all orders, viewing specific orders, updating order status
- **Firebase Optional**: Platform works without Firebase for basic functionality
- **Testing Tokens**: Use browser console to get ID token after login: `firebase.auth().currentUser.getIdToken()`

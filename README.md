# BharatBazaar - India's Online Marketplace

A complete, full-stack Indian e-commerce web application inspired by the functionality and shopping experience of Amazon India. Built with React 19, TypeScript, Express, Firebase Authentication, Cloud Firestore, and Google Gemini AI.

---

## 🌟 Key Features

### 1. Indian E-Commerce Experience & Homepage
- **Brand Identity:** Distinctive Indian marketplace branding (`BharatBazaar.in`) with Indian Rupee (`₹`) formatting.
- **Postal Code Delivery:** Delivery destination selector modal with presets for major Indian metro cities (Mumbai, New Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad) and 6-digit PIN validation.
- **Dynamic Search:** Live search bar with department category dropdown and auto-suggest trending queries.
- **Hero Carousel:** Festive Dhamaka banner sliders with call-to-actions.
- **Amazon 4-in-1 Category Cards:** Quad-image department showcase cards with direct category navigation.
- **Today's Deals:** Real-time countdown clock timer, discount badges (up to 70% off), and claim progress percentage.
- **Best Sellers Shelf:** Horizontal scrollable shelf with `#1 Best Seller` rank badges.
- **Recently Viewed Shelf:** Automatic browsing history tracking persisted locally.
- **Amazon India Footer:** 4-column directory, back to top, language selector, and Indian payment badge indicators (UPI, RuPay, Visa, Mastercard, Net Banking, COD).

### 2. Product Catalog & Advanced Filtering
- Multi-criteria sidebar filters:
  - Department categories (Mobiles, Electronics, Indian Ethnic, Home & Kitchen, Grocery, Books, Beauty, Sports).
  - Brand filter checkboxes.
  - Interactive price range slider (₹100 to ₹1,50,000+).
  - Customer star rating filters (4★ & Up, 3★ & Up, 2★ & Up).
  - Availability (In Stock only).
  - Fulfilled by BharatAssured toggle.
- Sort by Featured, Price (Low to High / High to Low), Average Customer Rating, and Newest Arrivals.
- Grid View and List View toggle.
- Active filter badges with instant dismiss tags.

### 3. Product Details Page
- High-resolution multi-image thumbnail gallery with preview.
- Star ratings breakdown with verified customer review counter.
- Pricing structure: Deal Price, M.R.P. strikethrough, You Save (%), Inclusive of all taxes.
- Bank & Promotional Offers: HDFC/ICICI 10% instant discounts, BharatPay UPI cashback, and No Cost EMI breakdown.
- Delivery Pincode checker with guaranteed delivery dates.
- Comprehensive technical specifications table.
- Stock availability warning (e.g., "Only 5 left in stock - order soon!").
- Quantity selector (1 to available stock, max 10).
- "Add to Cart" and "Buy Now" (instant checkout redirection).
- Customer Reviews & Ratings module with 5-star distribution bars, verified purchase badge, helpful votes, and "Write a Review" modal.
- Related products shelf ("Customers who viewed this item also viewed").

### 4. Authentication (Firebase Auth)
- Email & password registration and login.
- Google Sign-In with popup (`signInWithPopup`).
- Password reset email workflow.
- Real-time `onAuthStateChanged` persistence.
- Automatic profile synchronization in Cloud Firestore (`users/{uid}`).
- Role-based admin detection: `yogeshverma232003@gmail.com` + Demo Admin toggle switch for portfolio reviews.

### 5. Shopping Cart & Discounts
- Real-time synchronization with Firestore (`carts/{uid}`) and localStorage for guest sessions.
- Quantity increment/decrement bounded by stock levels.
- Free delivery threshold tracker (orders above ₹499 qualify for Free Delivery; otherwise ₹40).
- Validated coupon code system:
  - `BHARAT100`: ₹100 flat discount on orders above ₹499
  - `FESTIVAL500`: ₹500 flat discount on orders above ₹2,499
  - `DIWALI10`: 10% instant discount up to ₹1,500
  - `WELCOME50`: First order welcome discount
- "Save for Later" shelf with one-click "Move to Cart".
- Useful empty-cart state with direct CTAs.

### 6. Wishlist
- Add/remove items with persistent Firestore synchronization (`wishlists/{uid}`).
- One-click "Move to Cart".

### 7. Indian Address Book Management
- Delivery address book: Full Name, 10-digit Indian Mobile Number, Flat/House No., Street/Area, Landmark, City, State dropdown, 6-digit Indian PIN Code.
- Default delivery address selection.

### 8. Checkout & Secure Payments
- Multi-step checkout accordion:
  - Step 1: Delivery Address selection or creation
  - Step 2: Payment method choice (UPI, RuPay/Cards, Net Banking, Pay on Delivery)
  - Step 3: Review items & guaranteed delivery date
  - Step 4: Price breakup and Order Total
- **Trusted Backend Payment Verification (`/api/verify-payment`):**
  - Online payments are verified on the Express server before order confirmation.
  - Zero raw card storage (PCI-DSS safe).
  - Clear test mode sandbox simulation with bank OTP flow.
  - Cash on Delivery (Pay on Delivery) option.

### 9. Order Management & Tracking
- Orders stored in Firestore (`orders/{orderId}`) with item snapshots, addresses, and delivery estimates.
- Interactive 5-step delivery tracking timeline with real-time checkpoints (Placed → Confirmed → Shipped → Out for Delivery → Delivered).
- Tax Invoice generator: Formatted Indian GST Tax Invoice with printable view.
- Customer order cancellation before shipping with reason selection.

### 10. Admin Seller Portal
- Protected Admin Dashboard for store operators.
- KPI analytics: Verified Revenue (₹), Total Orders, Catalog Items, Low-stock alerts.
- Product Management: Add, edit, delete products, adjust pricing, upload image URLs, and restock low inventory.
- Order Management: View all customer orders, filter by status, update courier fulfillment status, and generate tracking numbers.
- Promotional coupon manager.

### 11. Bharat Mitra AI Shopping Assistant (Gemini 3.8 Flash)
- Grounded shopping concierge running on the trusted Express server (`/api/ai/assistant`).
- Answers questions about products, compares models, suggests products within budget in ₹ INR.
- AI API keys strictly kept on server side via `process.env.GEMINI_API_KEY`.

---

## 🛠 Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Backend:** Express.js, TypeScript (`tsx`), Vite middleware mode
- **Database & Auth:** Firebase Auth, Cloud Firestore (Enterprise Edition)
- **AI Engine:** Google Gemini API (`@google/genai`, `gemini-3.8-flash`)

---

## 📂 Project Structure

```
├── firebase-applet-config.json     # Provisioned Firebase credentials
├── firebase-blueprint.json         # Intermediate Data Schema Blueprint
├── firestore.rules                 # Hardened ABAC Firestore security rules
├── package.json                    # Project dependencies and full-stack scripts
├── server.ts                       # Express server with Vite middleware & APIs
├── src/
│   ├── firebase.ts                 # Firebase app, db, auth & error handlers
│   ├── types/
│   │   └── ecommerce.ts            # Type definitions for products, orders, etc.
│   ├── data/
│   │   └── mockProducts.ts         # Authentic Indian catalog data (30+ items)
│   ├── context/
│   │   ├── AuthContext.tsx         # Firebase Auth & Admin detection
│   │   ├── CartContext.tsx         # Cart state, coupons, delivery threshold
│   │   ├── LocationContext.tsx     # Indian delivery pincode & city lookup
│   │   └── WishlistContext.tsx     # Wishlist persistence
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          # Top bar with location, search, accounts
│   │   │   ├── SubNav.tsx          # Category shortcuts & deals
│   │   │   ├── Footer.tsx          # Amazon-style 4-column footer
│   │   │   ├── DrawerMenu.tsx      # Slide-out department menu
│   │   │   ├── AuthModal.tsx       # Sign In / Register / Password Reset
│   │   │   └── PincodeModal.tsx    # Indian pincode delivery selector
│   │   ├── home/
│   │   │   ├── HeroCarousel.tsx    # Festival banner slides
│   │   │   ├── CategoryTiles.tsx   # 4-in-1 multi-product cards
│   │   │   ├── DealsOfTheDay.tsx   # Countdown timer deals shelf
│   │   │   ├── BestSellersShelf.tsx# Best seller ranked shelf
│   │   │   └── RecentlyViewedShelf.tsx # Browsing history shelf
│   │   ├── catalog/
│   │   │   ├── ProductCard.tsx     # Grid & List product cards
│   │   │   ├── FilterSidebar.tsx   # Category, brand, price slider, rating
│   │   │   └── SortAndSearchBar.tsx# Sort dropdown & active chips
│   │   ├── product/
│   │   │   ├── ProductDetails.tsx  # Gallery, buy box, specs, offers
│   │   │   └── CustomerReviews.tsx # 5-star distribution, review submission
│   │   ├── cart/
│   │   │   └── CartPage.tsx        # Cart management & coupon box
│   │   ├── wishlist/
│   │   │   └── WishlistPage.tsx    # Wishlist management
│   │   ├── checkout/
│   │   │   ├── CheckoutPage.tsx    # Multi-step checkout
│   │   │   └── PaymentGatewayModal.tsx # UPI QR/ID & Card simulation
│   │   ├── orders/
│   │   │   ├── OrdersPage.tsx      # Order history, tracking & GST invoice
│   │   │   └── OrderSuccessPage.tsx# Celebration screen with confetti
│   │   ├── profile/
│   │   │   └── UserProfilePage.tsx # Address book & security
│   │   ├── admin/
│   │   │   └── AdminDashboard.tsx  # Seller central & stock management
│   │   └── ai/
│   │       └── AiAssistantDrawer.tsx # Bharat Mitra AI chat assistant
│   ├── App.tsx                     # Main application orchestrator
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind CSS imports
```

---

## 🔒 Security Architecture

1. **Server-Side API Key Isolation:** `GEMINI_API_KEY` is never bundled in frontend code. Client requests route through `/api/ai/assistant`.
2. **Server-Side Payment Verification:** `/api/verify-payment` validates the order amount against items before marking an order as verified.
3. **Hardened Firestore Security Rules:**
   - Products and categories are publicly readable; writes restricted to verified admin (`yogeshverma232003@gmail.com`).
   - Private user collections (`addresses`, `carts`, `wishlists`, `orders`) enforce `isOwner(userId)` checks.
   - Customers can cancel orders only if the status is `placed` or `confirmed`.
   - Client queries are checked against `resource.data.userId == request.auth.uid`.

---

## 🚀 Local Development & Deployment Instructions

### Prerequisites
- Node.js 18+ installed

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack development server (Express + Vite)
npm run dev

# 3. Open browser
http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

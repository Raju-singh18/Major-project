# EventMe — Project Report Reference Document
> This document contains all the real technical facts about your project.
> Use this as your source of truth when writing each section of your report.
> Do NOT copy-paste this as your report — use it to write in your own words.

---

## PROJECT IDENTITY

| Field | Value |
|---|---|
| Project Title | EventMe — An Online Event Discovery and Booking Platform |
| Project Type | Full-Stack Web Application |
| Technology Stack | MERN (MongoDB, Express.js, React.js, Node.js) |
| Frontend Build Tool | Vite |
| CSS Framework | Tailwind CSS |
| Deployment | Vercel (both client and server) |

---

## 1. PROBLEM STATEMENT (for Abstract / Introduction)

**The real problem your project solves:**

- Event discovery is fragmented — people search across multiple platforms (social media, WhatsApp groups, posters) to find local events.
- Small and independent event organizers have no affordable, dedicated platform to list, manage, and sell tickets for their events.
- Existing platforms like BookMyShow are too large and complex for small organizers; they charge high commissions and have strict listing requirements.
- Attendees have no single place to browse, book, track, and review events they attend.
- There is no real-time communication between organizers and their attendees after booking.

**What EventMe solves:**
- A unified platform where organizers can create and manage events, and users can discover, book, review, and wishlist events.
- Role-based access (User / Organizer / Admin) ensures each type of user gets exactly the features they need.
- Integrated payment via Razorpay, email notifications, PDF receipts, and a real-time notification system.

---

## 2. OBJECTIVES (for Introduction section)

Write one paragraph each explaining these objectives:

1. **Build a role-based multi-user platform** — Three distinct roles: User, Organizer, Admin. Each role has different permissions and dashboards.

2. **Enable event creation and management** — Organizers can create events with multiple ticket types, set seat limits, upload images via Cloudinary, and track bookings.

3. **Implement secure booking with payment** — Users can book tickets, pay via Razorpay (UPI, Net Banking, Cards), and receive PDF booking receipts via email.

4. **Provide real-time notifications** — Users receive in-app notifications for bookings, cancellations, event updates, and organizer announcements.

5. **Build an admin control panel** — Admin can approve/reject events, suspend users, manage hero slides, view platform-wide statistics, and edit legal pages.

6. **Implement secure authentication** — JWT-based auth, bcrypt password hashing, email verification on signup, forgot/reset password via email token.

7. **Enable social features** — Users can write reviews (only after attending), add events to wishlists, and get AI-powered event suggestions.

8. **Provide organizer analytics** — Organizers can view per-event dashboards showing bookings, revenue, ticket type breakdown, and ratings.

---

## 3. TECHNOLOGY STACK (for Tools & Technologies section)

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.2.0 | UI component library |
| React Router DOM | 6.20.0 | Client-side routing |
| Axios | 1.6.2 | HTTP requests to backend API |
| Tailwind CSS | 3.3.6 | Utility-first CSS styling |
| React Icons | 4.12.0 | Icon library (FontAwesome, etc.) |
| Vite | 7.3.1 | Build tool and dev server |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | Runtime | JavaScript server runtime |
| Express.js | 4.18.2 | Web framework for REST API |
| Mongoose | 8.0.0 | MongoDB ODM |
| bcryptjs | 2.4.3 | Password hashing |
| jsonwebtoken | 9.0.2 | JWT authentication tokens |
| Nodemailer | 8.0.1 | Email sending |
| Razorpay | 2.9.6 | Payment gateway integration |
| Cloudinary | 2.9.0 | Image upload and storage |
| PDFKit | 0.18.0 | PDF receipt generation |
| @google/generative-ai | 0.24.1 | AI-powered suggestions (Gemini) |
| groq-sdk | 1.1.2 | AI chat support |
| express-fileupload | 1.4.3 | File upload middleware |
| dotenv | 16.3.1 | Environment variable management |
| cors | 2.8.5 | Cross-Origin Resource Sharing |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud-hosted NoSQL database |

---

## 4. SYSTEM ARCHITECTURE

### Architecture Pattern
**Client-Server Architecture with REST API**

```
[Browser / React App]
        |
        | HTTPS requests (Axios)
        |
[Express.js REST API Server]
        |
   +---------+----------+
   |         |          |
[MongoDB] [Cloudinary] [Razorpay]
           (images)    (payments)
```

### How it works:
1. React frontend runs in the browser (deployed on Vercel)
2. All data operations go through REST API calls to the Express backend
3. Backend authenticates requests using JWT tokens
4. Data is stored in MongoDB Atlas (cloud)
5. Images are uploaded to Cloudinary
6. Payments are processed by Razorpay
7. Emails are sent via Nodemailer (SMTP)

### Frontend Architecture
- Single Page Application (SPA)
- React Context API for global state (AuthContext)
- React Router for navigation with protected routes
- Custom hooks: `useToast` for notifications
- Component structure: pages/, components/, components/ui/, components/luxury/

### Backend Architecture
- MVC Pattern (Model-View-Controller)
- Models: Mongoose schemas
- Controllers: Business logic
- Routes: URL mapping
- Middleware: Auth protection

---

## 5. DATABASE DESIGN

### Collections (MongoDB)

#### 5.1 Users Collection
```
Field                    | Type      | Description
-------------------------|-----------|---------------------------
_id                      | ObjectId  | Auto-generated unique ID
name                     | String    | Full name (required)
email                    | String    | Unique, lowercase
password                 | String    | bcrypt hashed (min 6 chars)
role                     | String    | enum: user/organizer/admin
isEmailVerified          | Boolean   | Email verification status
emailVerificationToken   | String    | Token for email verification
emailVerificationExpires | Date      | Token expiry
resetPasswordToken       | String    | Token for password reset
resetPasswordExpires     | Date      | Reset token expiry
avatar                   | String    | Cloudinary image URL
phone                    | String    | Optional phone number
bio                      | String    | Max 500 chars
address                  | String    | Physical address
suspended                | Boolean   | Account suspension flag
createdEvents            | ObjectId[]| Ref to Event (organizers)
bookedEvents             | ObjectId[]| Ref to Booking
wishlist                 | ObjectId[]| Ref to Event
createdAt / updatedAt    | Date      | Timestamps
```

#### 5.2 Events Collection
```
Field           | Type      | Description
----------------|-----------|---------------------------
_id             | ObjectId  | Auto-generated
title           | String    | Event name (required)
description     | String    | Full description
category        | String    | Music/Sports/Conference/Workshop/Festival/Theater/Other
date            | Date      | Event date
time            | String    | Event time string
location.venue  | String    | Venue name
location.address| String    | Street address
location.city   | String    | City
location.country| String    | Country
image           | String    | Cloudinary URL
organizer       | ObjectId  | Ref to User
ticketTypes     | Array     | [{name, price, quantity, sold}]
status          | String    | draft/published/cancelled/completed
totalSeats      | Number    | Total capacity
availableSeats  | Number    | Remaining seats
reviews         | Array     | Embedded [{user, rating, comment, createdAt}]
featured        | Boolean   | Featured on homepage
createdAt       | Date      | Timestamp
```

#### 5.3 Bookings Collection
```
Field            | Type      | Description
-----------------|-----------|---------------------------
_id              | ObjectId  | Auto-generated
event            | ObjectId  | Ref to Event
user             | ObjectId  | Ref to User
tickets          | Array     | [{ticketType, quantity, price}]
totalAmount      | Number    | Total payment amount
status           | String    | pending/confirmed/cancelled
bookingReference | String    | Unique reference code (e.g. EVT-XXXX)
paymentStatus    | String    | pending/completed/failed
paymentId        | String    | Razorpay payment ID
orderId          | String    | Razorpay order ID
createdAt        | Date      | Timestamp
```

#### 5.4 Reviews Collection
```
Field     | Type     | Description
----------|----------|---------------------------
event     | ObjectId | Ref to Event
user      | ObjectId | Ref to User
rating    | Number   | 1–5 stars
comment   | String   | Review text
createdAt | Date     | Timestamp
```
Unique index on (event + user) — one review per user per event.

#### 5.5 Notifications Collection
```
Field          | Type     | Description
---------------|----------|---------------------------
user           | ObjectId | Ref to User (recipient)
type           | String   | booking/event_update/event_reminder/cancellation/review/wishlist
title          | String   | Notification title
message        | String   | Full message
relatedEvent   | ObjectId | Ref to Event (optional)
relatedBooking | ObjectId | Ref to Booking (optional)
read           | Boolean  | Read/unread status
createdAt      | Date     | Timestamp
```

#### 5.6 Other Collections
- **Announcements** — Organizer broadcasts to event attendees
- **Contact** — Contact form submissions
- **HeroSlide** — Homepage carousel slides (admin managed)
- **LegalPage** — Privacy Policy and Terms of Service content (admin managed)

---

## 6. API ROUTES (for Backend Implementation section)

### Authentication — `/api/auth`
```
POST   /register          Register new user
POST   /login             Login, returns JWT token
GET    /verify-email/:token  Verify email address
POST   /forgot-password   Send reset email
POST   /reset-password/:token  Reset password
GET    /profile           Get current user profile (protected)
PUT    /profile           Update profile (protected)
DELETE /profile           Delete account (protected)
```

### Events — `/api/events`
```
GET    /                  Get all published events (with filters)
GET    /:id               Get single event details
POST   /                  Create event (organizer/admin)
PUT    /:id               Update event (organizer/admin)
DELETE /:id               Delete event (organizer/admin)
GET    /my-events         Get organizer's own events
GET    /suggestions       AI-powered event suggestions
```

### Bookings — `/api/bookings`
```
POST   /                  Create booking + Razorpay order
POST   /verify-payment    Verify Razorpay payment signature
GET    /my-bookings       Get user's bookings
PUT    /:id/cancel        Cancel a booking
GET    /:id/receipt       Download PDF receipt
```

### Admin — `/api/admin`
```
GET    /stats             Platform-wide statistics
GET    /users             All users
GET    /organizers        All organizers with stats
GET    /events            All events
GET    /reviews           All reviews
PUT    /users/:id         Update user role
DELETE /users/:id         Delete user
PUT    /users/:id/suspend    Suspend user
PUT    /users/:id/unsuspend  Unsuspend user
PUT    /events/:id/approve   Approve event
PUT    /events/:id/reject    Reject event
DELETE /events/:id           Delete event
DELETE /reviews/:id          Delete review
GET    /contact-info         Public contact info
```

### Organizer — `/api/organizer`
```
GET    /stats                    Overall organizer statistics
GET    /event-dashboard/:eventId Per-event analytics
```

### Other Routes
```
/api/notifications   — CRUD for user notifications
/api/reviews         — Create/delete reviews
/api/wishlist        — Add/remove/get wishlist
/api/announcements   — Organizer announcements to attendees
/api/upload          — Cloudinary image upload
/api/contact         — Contact form submission
/api/hero-slides     — Homepage slider management
/api/chat            — AI chat support (Groq)
/api/legal           — Privacy Policy / Terms of Service
```

---

## 7. MODULES BREAKDOWN (for Modules & Functionalities section)

### Module 1: Authentication System
**Files:** `server/controllers/authController.js`, `server/middleware/authMiddleware.js`

**How it works:**
1. User registers → password hashed with bcrypt (salt rounds: 10) → email verification token generated → verification email sent via Nodemailer
2. User clicks email link → token verified → `isEmailVerified` set to true
3. User logs in → password compared with bcrypt → JWT token generated (contains user ID and role) → token returned to client
4. Client stores token in `localStorage` as part of `userInfo` object
5. Every protected API request sends `Authorization: Bearer <token>` header
6. `authMiddleware.js` verifies token → attaches `req.user` → passes to controller

**Security measures:**
- Passwords never stored in plain text (bcrypt)
- JWT tokens expire (configurable)
- Email must be verified before login is allowed
- Suspended accounts are blocked at middleware level
- Password reset tokens expire after a set time

### Module 2: Event Management
**Files:** `server/controllers/eventController.js`, `client/src/pages/CreateEvent.jsx`, `client/src/pages/EditEvent.jsx`

**How it works:**
1. Organizer fills create event form (title, description, category, date, time, location, ticket types, image)
2. Image uploaded to Cloudinary via `/api/upload` → URL stored in event
3. Event saved with status `published` by default (admin can change to require approval)
4. Admin can approve (set to `published`) or reject (set to `cancelled`) events
5. Available seats calculated from sum of all ticket type quantities
6. When a booking is made, `availableSeats` decrements and `ticketType.sold` increments

**Ticket Types:**
Each event can have multiple ticket types (e.g., General ₹500, VIP ₹1500, Student ₹200). Each has its own quantity and sold count.

### Module 3: Booking & Payment
**Files:** `server/controllers/bookingController.js`, `server/config/razorpay.js`

**Payment Flow:**
1. User selects tickets → clicks "Book Now"
2. Frontend calls `POST /api/bookings` → backend creates Razorpay order → returns `orderId` and `amount`
3. Razorpay checkout opens in browser (handles UPI, cards, net banking)
4. On payment success → Razorpay returns `paymentId`, `orderId`, `signature`
5. Frontend calls `POST /api/bookings/verify-payment` → backend verifies HMAC signature
6. If valid → booking status set to `confirmed`, `paymentStatus` set to `completed`
7. Seats decremented, notification created, PDF receipt generated and emailed

**Booking Reference:** Auto-generated unique code (e.g., `EVT-A3F9K2`) stored in booking.

**Free Events:** If `totalAmount === 0`, payment step is skipped, booking confirmed directly.

### Module 4: User Dashboard
**File:** `client/src/pages/UserDashboard.jsx`

Shows:
- Upcoming confirmed bookings count
- Past events count
- Total amount spent
- Unread notifications count
- List of upcoming events with event image, date, time, location
- Recent bookings with status badges

### Module 5: Organizer Dashboard
**File:** `client/src/pages/OrganizerDashboard.jsx`, `server/controllers/organizerController.js`

Stats from `/api/organizer/stats`:
- Total events created
- Published events count
- Total tickets sold across all events
- Total revenue earned
- Upcoming vs past events
- Total bookings received
- Average rating across all events

Per-event analytics from `/api/organizer/event-dashboard/:id`:
- Confirmed vs cancelled bookings
- Revenue per ticket type
- Attendee list
- Average rating and review count

### Module 6: Admin Dashboard
**File:** `client/src/pages/AdminDashboard.jsx`

Tabs:
1. **Overview** — Platform stats (users, events, bookings, revenue)
2. **Users** — View all users, change roles, suspend/unsuspend, delete
3. **Organizers** — View organizers with their event and revenue stats
4. **Events** — Approve/reject/delete events
5. **Reviews** — View and delete any review
6. **Contacts** — View contact form submissions
7. **Slider** — Manage homepage hero carousel slides
8. **Legal** — Edit Privacy Policy and Terms of Service content

### Module 7: Notification System
**File:** `server/models/Notification.js`, `server/utils/notificationHelper.js`

Notification types: `booking`, `event_update`, `event_reminder`, `cancellation`, `review`, `wishlist`

Triggered automatically when:
- A booking is confirmed
- An event is cancelled
- An organizer sends an announcement
- Admin approves or rejects an event
- Account is suspended or reactivated

Navbar shows unread count badge, polling every 30 seconds.

### Module 8: Reviews System
**File:** `server/models/Review.js`, `server/controllers/reviewController.js`

- Only users with a confirmed booking for an event can leave a review
- One review per user per event (enforced by unique compound index)
- Rating: 1–5 stars
- Reviews displayed on event detail page with average rating

### Module 9: Wishlist
**File:** `server/controllers/wishlistController.js`

- Users can add/remove events from their wishlist
- Wishlist stored as array of Event ObjectIds in User document
- Dedicated Wishlists page shows all saved events

### Module 10: AI Features
**Files:** `server/controllers/chatController.js`

- **AI Chat Support** — Powered by Groq SDK, answers user questions about the platform
- **Event Suggestions** — Uses Google Gemini AI to suggest events based on user preferences/history

### Module 11: Email System
**Files:** `server/utils/sendEmail.js`, `server/utils/emailTemplates.js`

Emails sent for:
- Email verification on signup
- Password reset link
- Booking confirmation with PDF receipt attached
- Event approval/rejection notification to organizer
- Account suspension/reactivation notice
- Organizer announcements to attendees

### Module 12: Legal Pages
**Files:** `server/models/LegalPage.js`, `server/controllers/legalController.js`

- Admin can edit Privacy Policy and Terms of Service from the dashboard
- Content stored in MongoDB with sections array
- Public API endpoint serves content to frontend pages

---

## 8. FRONTEND COMPONENT STRUCTURE

```
client/src/
├── App.jsx                    — Root component, all routes defined here
├── main.jsx                   — React DOM render entry point
├── index.css                  — Global styles
├── luxury.css                 — Premium UI styles
│
├── config/
│   └── api.js                 — Axios instance with base URL + auth interceptor
│
├── context/
│   └── AuthContext.jsx        — Global auth state (user, login, logout)
│
├── hooks/
│   └── useToast.js            — Custom hook for toast notifications
│
├── components/
│   ├── Navbar.jsx             — Top navigation with role-based links
│   ├── Footer.jsx             — Site footer with links and newsletter
│   ├── ScrollToTop.jsx        — Scroll to top on route change
│   ├── PrivateRoute.jsx       — Route guard for authenticated pages
│   ├── EventCard.jsx          — Reusable event card component
│   ├── ReviewSection.jsx      — Reviews display and submission
│   ├── ImageUpload.jsx        — Cloudinary image upload component
│   ├── WaveBackground.jsx     — Decorative background component
│   ├── Toast.jsx              — Individual toast notification
│   ├── ToastContainer.jsx     — Toast notification container
│   │
│   ├── ui/                    — Base UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Alert.jsx
│   │   └── LoadingSpinner.jsx
│   │
│   └── luxury/                — Premium styled variants
│       ├── LuxuryButton.jsx
│       ├── LuxuryCard.jsx
│       ├── LuxuryInput.jsx
│       ├── LuxuryModal.jsx
│       └── LuxuryBadge.jsx
│
└── pages/
    ├── Home.jsx               — Landing page with hero slider
    ├── Events.jsx             — Browse all events with filters
    ├── EventDetails.jsx       — Single event page with booking
    ├── CreateEvent.jsx        — Create new event form
    ├── EditEvent.jsx          — Edit existing event
    ├── EventDashboard.jsx     — Per-event analytics (organizer)
    ├── MyEvents.jsx           — Organizer's event list
    ├── MyBookings.jsx         — User's booking history
    ├── UserDashboard.jsx      — User overview dashboard
    ├── OrganizerDashboard.jsx — Organizer overview dashboard
    ├── AdminDashboard.jsx     — Full admin control panel
    ├── Profile.jsx            — User profile management
    ├── Notifications.jsx      — Notification center
    ├── Wishlists.jsx          — Saved events
    ├── Suggestions.jsx        — AI event suggestions
    ├── Contact.jsx            — Contact form + FAQ + AI chat
    ├── Login.jsx              — Login page
    ├── Register.jsx           — Registration page
    ├── VerifyEmail.jsx        — Email verification handler
    ├── ForgotPassword.jsx     — Forgot password form
    ├── ResetPassword.jsx      — Reset password form
    ├── PrivacyPolicy.jsx      — Privacy policy (from backend)
    └── TermsOfService.jsx     — Terms of service (from backend)
```

---

## 9. SECURITY IMPLEMENTATION

| Security Measure | Implementation |
|---|---|
| Password hashing | bcryptjs with salt rounds = 10 |
| Authentication | JWT tokens in Authorization header |
| Route protection | `protect` middleware on all private routes |
| Role-based access | `admin` and `organizer` middleware |
| Email verification | Token-based, expires after set time |
| Password reset | Secure token, single-use, expires |
| Payment verification | HMAC-SHA256 signature verification (Razorpay) |
| Account suspension | Checked at middleware level, blocks all requests |
| CORS | Configured on Express server |
| Environment variables | All secrets in `.env`, never committed |

---

## 10. KEY WORKFLOWS (for System Workflow section)

### User Registration Flow
```
1. User fills registration form (name, email, password, role)
2. POST /api/auth/register
3. Backend checks if email already exists
4. Password hashed with bcrypt
5. emailVerificationToken generated (crypto.randomBytes)
6. User saved to MongoDB
7. Verification email sent via Nodemailer
8. User clicks link → GET /api/auth/verify-email/:token
9. Token matched and not expired → isEmailVerified = true
10. User can now log in
```

### Event Booking Flow
```
1. User views event → selects ticket types and quantities
2. POST /api/bookings → backend creates Razorpay order
3. Razorpay checkout opens (UPI / Card / Net Banking)
4. User completes payment
5. POST /api/bookings/verify-payment with paymentId, orderId, signature
6. Backend verifies HMAC signature
7. Booking status → confirmed, paymentStatus → completed
8. availableSeats decremented, ticketType.sold incremented
9. Notification created for user
10. PDF receipt generated (PDFKit) and emailed (Nodemailer)
```

### Admin Event Approval Flow
```
1. Organizer creates event (status: draft or published)
2. Admin sees event in Events tab
3. Admin clicks Approve → PUT /api/admin/events/:id/approve
4. Event status → published
5. Notification sent to organizer
6. Approval email sent to organizer
```

---

## 11. DEPLOYMENT

| Component | Platform | Notes |
|---|---|---|
| Frontend | Vercel | `client/vercel.json` configured |
| Backend | Vercel | `server/vercel.json` configured |
| Database | MongoDB Atlas | Cloud-hosted |
| Images | Cloudinary | CDN delivery |
| Payments | Razorpay | Test mode available |

---

## 12. LIMITATIONS (write about these honestly)

1. **No real-time updates** — Notification count polls every 30 seconds instead of using WebSockets
2. **International payments not supported** — Razorpay only supports Indian payment methods
3. **No mobile app** — Web only, though responsive design works on mobile browsers
4. **No seat map** — Tickets are quantity-based, not seat-selection based
5. **Single currency** — Only INR (₹) supported
6. **No recurring events** — Each event must be created individually
7. **Image storage dependency** — Relies on Cloudinary free tier limits

---

## 13. FUTURE SCOPE (write about these)

1. **WebSocket integration** — Real-time notifications using Socket.io instead of polling
2. **Mobile app** — React Native app using the same backend API
3. **Seat selection** — Interactive venue seat map for seat-specific booking
4. **Multi-currency support** — Stripe integration for international payments
5. **QR code tickets** — Generate QR codes for event check-in
6. **Advanced AI recommendations** — Collaborative filtering based on booking history
7. **Event streaming** — Live streaming integration for virtual events
8. **Organizer verification** — KYC process for organizer accounts
9. **Affiliate/referral system** — Discount codes and referral tracking
10. **Analytics dashboard** — Advanced charts with Chart.js or Recharts

---

## 14. REFERENCES TO CITE

### Technologies (official docs)
- React.js — https://react.dev
- Node.js — https://nodejs.org
- Express.js — https://expressjs.com
- MongoDB — https://www.mongodb.com/docs
- Mongoose — https://mongoosejs.com/docs
- Tailwind CSS — https://tailwindcss.com/docs
- Razorpay — https://razorpay.com/docs
- Cloudinary — https://cloudinary.com/documentation
- JWT — https://jwt.io/introduction
- bcryptjs — https://www.npmjs.com/package/bcryptjs

### Research Papers / Books to reference
- "MongoDB: The Definitive Guide" — Kristina Chodorow
- "Node.js Design Patterns" — Mario Casciaro
- "Learning React" — Alex Banks & Eve Porcello
- Research papers on MERN stack web applications (search Google Scholar)
- Papers on online event management systems

---

## 15. SAMPLE CODE SNIPPETS (for Appendix)

### JWT Middleware (authMiddleware.js concept)
```javascript
// Protect route — verify JWT token
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  next();
};
```

### Password Hashing (User model)
```javascript
// Before saving, hash password if modified
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### Razorpay Payment Verification
```javascript
// Verify payment signature using HMAC-SHA256
const body = orderId + '|' + paymentId;
const expectedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(body)
  .digest('hex');
const isValid = expectedSignature === signature;
```

### React Auth Context (concept)
```javascript
// Global auth state available to all components
const AuthContext = createContext();
// Provides: user, login(), logout()
// Persists to localStorage
```

---

*This document was auto-generated from the actual EventMe codebase.
All technical details are accurate and based on real implementation.*

import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Full EventMe platform knowledge injected as system context
const SYSTEM_CONTEXT = `You are the official support assistant for EventMe — an event management and ticketing platform. Answer questions naturally and helpfully. Be concise but complete. Give step-by-step instructions when needed.

ABOUT EVENTME:
EventMe is a full-stack web app where users discover, book, and manage event tickets. Organizers create and manage events. Admins manage the entire platform.

USER ROLES:
- User: browse events, book tickets, cancel bookings (future events only), write reviews (past events), manage wishlist, view notifications, update profile. CANNOT create events.
- Organizer: everything a User can + create/manage events, organizer dashboard
- Admin: full platform access — users, events, bookings, reviews, hero slider, contacts

BOOKING:
- Select ticket type and quantity on event details page, click "Book Tickets"
- Payment via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking (Indian banks), domestic Indian cards ONLY
- International cards NOT supported
- If Razorpay fails, a "Test Payment" button appears as development fallback
- Booking reference starts with "BK" (e.g. BK1234567890ABC)
- Booking statuses: pending, confirmed, cancelled
- View all bookings in "My Bookings" from navbar

CANCELLATION:
- Only confirmed bookings for FUTURE events can be cancelled
- Go to "My Bookings" → find booking → click "Cancel Booking" button
- Past events CANNOT be cancelled
- Already-cancelled bookings cannot be cancelled again
- When cancelled: seats released back to event, cancellation notification sent
- No automatic refund — contact support for refund queries with booking reference

PAYMENT METHODS (Razorpay):
- UPI: Google Pay, PhonePe, Paytm, BHIM — RECOMMENDED
- Net Banking: all major Indian banks
- Indian Debit/Credit cards (domestic only)
- International cards: NOT supported
- Test UPI for testing: success@razorpay

CREATING EVENTS:
- Requires Organizer account (register with "Create Events" role or contact support to upgrade)
- Click "Create" in navbar → fill title, description, category, date, time, venue, city, country
- Upload event image (Cloudinary)
- Add ticket types with name, price, quantity
- Events published immediately
- Users with "User" role CANNOT create events

PROFILE:
- Update name, email, phone, bio, profile photo from Profile page
- Profile photos upload to Cloudinary (max 3MB, JPEG/PNG/WebP)
- Click avatar in edit mode to upload new photo
- Changes reflect in navbar immediately

PASSWORD:
- Forgot password: Login page → "Forgot password?" → enter email → reset link sent (valid 1 hour)
- Change while logged in: Profile → Edit Profile → New Password field → Save

NOTIFICATIONS:
- Sent for: booking confirmed, booking cancelled, event updates, account suspension
- Bell icon in navbar → view all, mark as read

WISHLIST:
- Heart icon on event cards or "Save" button on event details page
- View in "Wishlists" from navbar

REVIEWS:
- Only for past confirmed bookings
- My Bookings → past event → "Write a Review"
- Rating 1-5 stars, comment min 10 characters, one review per booking

ACCOUNT SUSPENSION:
- Suspended users cannot book or create events
- Contact support to appeal, admin reviews within 24-48 hours

RULES FOR YOU:
- Answer any question about EventMe naturally and helpfully
- If completely unrelated to EventMe (weather, math, etc.), politely say you only help with EventMe
- Never make up features that don't exist
- Keep responses friendly and concise
- Do NOT use markdown ## headers in responses`;

const callGroq = async (message, history) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('NO_GROQ_KEY');

  const groq = new Groq({ apiKey });

  const messages = [
    { role: 'system', content: SYSTEM_CONTEXT },
    ...history.slice(-8).map(m => ({
      role: m.from === 'user' ? 'user' : 'assistant',
      content: m.text
    })),
    { role: 'user', content: message }
  ];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages,
    max_tokens: 512,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || '';
};

const callGemini = async (message, history) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('NO_GEMINI_KEY');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_CONTEXT,
  });

  // Gemini requires history to start with user and strictly alternate
  let chatHistory = history.slice(-8).map(m => ({
    role: m.from === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }]
  }));

  // Remove leading model messages
  while (chatHistory.length > 0 && chatHistory[0].role === 'model') chatHistory.shift();

  // Ensure strict alternation
  const clean = [];
  for (const msg of chatHistory) {
    const last = clean[clean.length - 1];
    if (!last || last.role !== msg.role) clean.push(msg);
  }

  // Remove last user entry (sent separately)
  if (clean.length > 0 && clean[clean.length - 1].role === 'user') clean.pop();

  const session = model.startChat({ history: clean });
  const result = await session.sendMessage(message);
  return result.response.text();
};

export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Try Groq first (faster, more reliable free tier)
    try {
      const reply = await callGroq(message, history);
      if (reply) return res.json({ reply, provider: 'groq' });
    } catch (groqErr) {
      if (groqErr.message !== 'NO_GROQ_KEY') {
        console.error('Groq error:', groqErr.message);
      }
    }

    // Fall back to Gemini
    try {
      const reply = await callGemini(message, history);
      if (reply) return res.json({ reply, provider: 'gemini' });
    } catch (geminiErr) {
      if (geminiErr.message !== 'NO_GEMINI_KEY') {
        console.error('Gemini error:', geminiErr.message);
      }
    }

    // Both failed — return a helpful message, not a silent fallback
    return res.json({
      reply: "I'm having trouble connecting to the AI service right now. Please use the contact form below to send us your question and we'll respond within 24 hours. 😊",
      fallback: true
    });

  } catch (error) {
    console.error('Chat controller error:', error.message);
    res.json({
      reply: "Something went wrong on my end. Please use the contact form below to reach our support team.",
      fallback: true
    });
  }
};

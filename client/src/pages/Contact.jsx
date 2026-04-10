import { useState, useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane,
  FaComments, FaQuestionCircle, FaCheckCircle,
  FaTimes, FaChevronDown, FaChevronUp, FaRobot, FaUser
} from 'react-icons/fa';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: 'How do I book tickets?',
    a: 'Go to the Events page → click any event → select ticket type and quantity using the +/− buttons → click "Book Tickets" → complete payment via Razorpay. Your booking is confirmed instantly and appears in "My Bookings" with a reference number starting with BK.'
  },
  {
    q: 'How do I cancel a booking?',
    a: 'Go to "My Bookings" from the navbar → find the booking → click "Cancel Booking". The button only appears for confirmed bookings on future events. Once cancelled, your seats are released back to the event and you receive a cancellation notification. Past events cannot be cancelled.'
  },
  {
    q: 'What payment methods are accepted?',
    a: 'EventMe uses Razorpay. Accepted methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking (all major Indian banks), and domestic Indian Debit/Credit cards. International cards are NOT supported. If payment fails, a "Test Payment" button appears as a fallback for development.'
  },
  {
    q: 'How do I create an event?',
    a: 'You need an Organizer account. Register with the "Create Events" role or contact support to upgrade. Then click "Create" in the navbar, fill in event details (title, description, category, date, time, venue), upload an image, add ticket types with prices and quantities, and submit. Events are published immediately.'
  },
  {
    q: 'How do I become an Organizer?',
    a: 'During registration, select "Create Events" as your role. If you already have a User account, contact our support team to upgrade. Organizers can create and manage events, view bookings for their events, and access the Organizer Dashboard.'
  },
  {
    q: 'How do I write a review?',
    a: 'You can review an event after it has taken place. Go to "My Bookings" → find a past confirmed booking → click "Write a Review" → give a star rating (1–5) and write a comment (minimum 10 characters) → click "Submit Review". Each booking can only be reviewed once.'
  },
  {
    q: 'How do I reset my password?',
    a: 'On the Login page, click "Forgot password?" → enter your email → check your inbox for a reset link (valid for 1 hour) → click the link → enter your new password. To change your password while logged in, go to Profile → Edit Profile → enter a new password → Save Changes.'
  },
  {
    q: 'How do I upload a profile photo?',
    a: 'Go to Profile from the navbar → click "Edit Profile" → click your avatar image → select a photo from your device (JPEG, PNG, WebP, max 3MB). The image uploads to Cloudinary automatically. Click "Save Changes" to apply. Your new photo appears in the navbar immediately.'
  },
];

// ── Project-accurate knowledge base ──────────────────────────────────────────
const KB = [
  // Booking flow
  {
    tags: ['book', 'ticket', 'how to book', 'purchase', 'buy'],
    answer: `To book tickets on EventMe:\n1. Go to the Events page\n2. Click on any event\n3. Select ticket type and quantity using the +/− buttons\n4. Click "Book Tickets"\n5. Complete payment via Razorpay (UPI, Net Banking, or Indian cards)\n\nYour booking is confirmed instantly and you'll get a notification. You can view it in "My Bookings".`
  },
  // Cancel booking — accurate based on actual cancelBooking controller
  {
    tags: ['cancel', 'cancellation', 'cancel booking', 'cancel ticket','cancel my booking'],
    answer: `To cancel a booking:\n1. Go to "My Bookings" from the navbar\n2. Find the booking you want to cancel\n3. Click the "Cancel Booking" button (only visible for upcoming confirmed events)\n\n⚠️ Important:\n• You can only cancel confirmed bookings for future events\n• Past events cannot be cancelled\n• Already-cancelled bookings cannot be cancelled again\n• When cancelled, your seats are released back to the event\n• A cancellation notification will be sent to you\n\nFor refund queries, please use the contact form below.`
  },
  // Refund
  {
    tags: ['refund', 'money back', 'return money'],
    answer: `Refunds are processed based on the event organizer's policy. After cancelling your booking from "My Bookings", contact us via the form below with your booking reference (starts with BK...) and we'll assist with the refund process.`
  },
  // Payment methods — accurate from Razorpay config
  {
    tags: ['payment', 'pay', 'upi', 'card', 'razorpay', 'net banking', 'international'],
    answer: `EventMe uses Razorpay for secure payments.\n\n✅ Accepted methods:\n• UPI — Google Pay, PhonePe, Paytm, BHIM\n• Net Banking — all major Indian banks\n• Indian Debit/Credit cards (domestic only)\n\n❌ Not supported:\n• International cards (Visa/Mastercard issued outside India)\n\n💡 Tip: If payment fails, use the "Test Payment" button that appears — it creates a real booking for development/testing.`
  },
  // Create event — accurate from CreateEvent.jsx and eventController
  {
    tags: ['create event', 'organizer', 'host event', 'add event', 'publish event'],
    answer: `To create events you need an Organizer account:\n\n1. Register with the "Create Events" role, OR contact us to upgrade your existing account\n2. Once you're an Organizer, click "Create" in the navbar\n3. Fill in: title, description, category, date, time, venue, city, country\n4. Upload an event image via Cloudinary\n5. Add ticket types with name, price, and quantity\n6. Submit — your event is published immediately\n\n⚠️ Users with the "User" role cannot create events.`
  },
  // My bookings
  {
    tags: ['my bookings', 'view booking', 'booking history', 'find booking', 'booking reference'],
    answer: `To view your bookings:\n1. Click your profile in the navbar\n2. Select "My Bookings" or go to the Bookings link\n\nYou'll see:\n• Booking reference (BK...)\n• Event details, date, venue\n• Ticket types and quantities\n• Payment status\n• Cancel button (for upcoming events)\n• Review button (for past events)`
  },
  // Review
  {
    tags: ['review', 'rating', 'feedback', 'rate event'],
    answer: `You can review an event after it has taken place:\n1. Go to "My Bookings"\n2. Find a past confirmed booking\n3. Click "Write a Review"\n4. Give a star rating (1–5) and write a comment (min 10 characters)\n5. Click "Submit Review"\n\nYou can only review events you've attended and each event can only be reviewed once per booking.`
  },
  // Wishlist
  {
    tags: ['wishlist', 'save event', 'favourite', 'heart', 'saved'],
    answer: `To save events to your wishlist:\n• On any event card, click the ❤️ heart icon\n• On the event details page, click the "Save" button\n\nView all saved events in "Wishlists" from the navbar. You can remove events from your wishlist at any time.`
  },
  // Notifications
  {
    tags: ['notification', 'bell', 'alert', 'unread'],
    answer: `Notifications are sent for:\n• Booking confirmed\n• Booking cancelled\n• Event updates from organizers\n• Account suspension/reactivation\n\nClick the 🔔 bell icon in the navbar to view all notifications. You can mark them as read individually or all at once.`
  },
  // Profile / avatar
  {
    tags: ['profile', 'avatar', 'photo', 'picture', 'update profile', 'change name'],
    answer: `To update your profile:\n1. Click your avatar in the navbar → "Profile"\n2. Click "Edit Profile"\n3. Update your name, email, phone, or bio\n4. To change your photo: click your avatar (in edit mode) → select an image file\n5. The image uploads to Cloudinary automatically\n6. Click "Save Changes"\n\nYour updated avatar will appear in the navbar immediately.`
  },
  // Password
  {
    tags: ['password', 'forgot password', 'reset password', 'change password'],
    answer: `To reset a forgotten password:\n1. Go to the Login page\n2. Click "Forgot password?"\n3. Enter your email address\n4. Check your inbox for a reset link (valid for 1 hour)\n5. Click the link and enter your new password\n\nTo change your password while logged in:\n1. Go to Profile → Edit Profile\n2. Enter your new password in the "New Password" field\n3. Save Changes`
  },
  // Account suspended
  {
    tags: ['suspended', 'account suspended', 'banned', 'blocked'],
    answer: `If your account is suspended:\n• You cannot book events or create events\n• You'll see a "🚫 Account Suspended" message\n• Contact our support team via the form below to appeal\n• Provide your email address and booking reference if applicable\n\nSuspensions are reviewed by our admin team within 24–48 hours.`
  },
  // Roles
  {
    tags: ['role', 'user role', 'organizer role', 'admin', 'upgrade account'],
    answer: `EventMe has 3 roles:\n\n👤 User — can browse events, book tickets, write reviews, manage wishlist\n✨ Organizer — everything a User can do + create/manage events\n👑 Admin — full platform access including user management\n\nTo become an Organizer, register with the "Create Events" option or contact support to upgrade your existing account.`
  },
  // Greetings
  {
    tags: ['hello', 'hi', 'hey', 'help', 'support', 'assist'],
    answer: `Hi there! 👋 I'm the EventMe support assistant.\n\nI can help you with:\n• Booking & cancelling tickets\n• Payment issues\n• Creating events\n• Profile & account settings\n• Wishlists & notifications\n\nWhat do you need help with?`
  },
];

// Smarter matching — score by how many keywords match
const getBotReply = (msg) => {
  const lower = msg.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const item of KB) {
    const score = item.tags.filter(tag => lower.includes(tag)).length;
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  if (best && bestScore > 0) return best.answer;

  return "I'm not sure about that. Could you rephrase your question? Or use the contact form below to send us a detailed message — we'll respond within 24 hours. 😊";
};

// ── Chat Widget ───────────────────────────────────────────────────────────────
const ChatWidget = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: `Hi${user?.name ? ' ' + user.name.split(' ')[0] : ''}! 👋 I'm the EventMe support assistant.\n\nI can help with bookings, cancellations, payments, events, and more. What do you need help with?`,
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text = input.trim()) => {
    if (!text || typing) return;
    setMessages(prev => [...prev, { from: 'user', text, time: new Date() }]);
    setInput('');
    setTyping(true);

    const history = messages.slice(-8).map(m => ({ from: m.from, text: m.text }));

    try {
      const { data } = await api.post('/chat', { message: text, history });
      setMessages(prev => [...prev, { from: 'bot', text: data.reply, time: new Date() }]);
    } catch (err) {
      console.error('Chat error:', err.response?.data || err.message);
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(text), time: new Date() }]);
    } finally {
      setTyping(false);
    }
  };

  const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const QUICK = ['How to book tickets?', 'Cancel my booking', 'Payment methods', 'Create an event', 'Reset password'];

  return (
    <div className="fixed bottom-6 right-6 z-[200] w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '560px' }}>
      {/* Header */}
      <div className="bg-purple-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <FaRobot className="text-white text-lg" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">EventMe AI Support</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-white/80 text-xs">Powered by Groq AI · Instant replies</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10">
          <FaTimes />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.from === 'bot' ? 'bg-purple-600' : 'bg-orange-500'}`}>
              {msg.from === 'bot' ? <FaRobot className="text-white text-xs" /> : <FaUser className="text-white text-xs" />}
            </div>
            <div className={`max-w-[78%] flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.from === 'bot' ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm' : 'bg-purple-600 text-white rounded-tr-sm'}`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400">{fmt(msg.time)}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
              <FaRobot className="text-white text-xs" />
            </div>
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }}></span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Quick replies */}
      <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0">
        {QUICK.map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            className="flex-shrink-0 text-xs px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full hover:bg-purple-100 font-medium whitespace-nowrap">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !typing && sendMessage()}
          placeholder="Ask me anything..."
          disabled={typing}
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-purple-400 disabled:opacity-60"
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || typing}
          className="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center disabled:opacity-40 flex-shrink-0">
          <FaPaperPlane className="text-xs" />
        </button>
      </div>
    </div>
  );
};

// ── FAQ Accordion ─────────────────────────────────────────────────────────────
const FAQAccordion = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className={`border rounded-xl overflow-hidden transition-colors ${open === i ? 'border-purple-300' : 'border-gray-200'}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
            {open === i
              ? <FaChevronUp className="text-purple-600 flex-shrink-0 text-xs" />
              : <FaChevronDown className="text-gray-400 flex-shrink-0 text-xs" />
            }
          </button>
          {open === i && (
            <div className="px-4 pb-4 bg-white border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed pt-3">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ── Main Contact Page ─────────────────────────────────────────────────────────
const Contact = () => {
  const formRef = useRef(null);
  const location = useLocation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const { showToast, toasts, removeToast } = useToast();

  // Auto-open chat if navigated here with state.openChat
  useEffect(() => {
    if (location.state?.openChat) {
      setChatOpen(true);
      window.history.replaceState({}, document.title);
    }
    if (location.hash === '#faq') {
      setTimeout(() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }, [location]);

  useEffect(() => {
    api.get('/admin/contact-info')
      .then(({ data }) => setContactInfo(data))
      .catch(() => setContactInfo({
        email: 'support@eventme.com',
        phone: '+91 0000000000',
        address: 'EventMe HQ',
        name: 'EventMe Support'
      }));
  }, []);

  const scrollToForm = (preSubject = '') => {
    if (preSubject) setFormData(prev => ({ ...prev, subject: preSubject }));
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSubmitted(true);
        showToast("✉️ Message sent! We'll respond within 24 hours.", 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      showToast(err.response?.data?.message || '❌ Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Chat Widget */}
      {chatOpen && <ChatWidget onClose={() => setChatOpen(false)} />}

      {/* Floating chat button when closed */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700"
          title="Start Chat"
        >
          <FaComments className="text-xl" />
        </button>
      )}

      {/* Hero */}
      <div className="pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 px-4 py-2 rounded-full mb-5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm text-green-700">We're Online — Ready to Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-3xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about EventMe? We're here to help you succeed.
          </p>
        </div>
      </div>

      {/* Contact Method Cards */}
      <div className="container mx-auto px-4 sm:px-6 mb-6 sm:mb-12 max-w-6xl">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-white text-xl" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Email Support</h3>
            <p className="text-gray-500 text-sm mb-3">Response within 24 hours</p>
            <a href={`mailto:${contactInfo?.email || 'support@eventme.com'}`} className="text-purple-600 font-semibold text-sm hover:text-purple-700">
              {contactInfo?.email || 'support@eventme.com'}
            </a>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-white text-xl" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Live Chat</h3>
            <p className="text-gray-500 text-sm mb-3">Instant help, available now</p>
            <button
              onClick={() => setChatOpen(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-white text-xl" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
            <p className="text-gray-500 text-sm mb-3">Mon–Fri, 9 AM – 6 PM</p>
            <a href={`tel:${contactInfo?.phone || ''}`} className="text-purple-600 font-semibold text-sm hover:text-purple-700">
              {contactInfo?.phone || '+91 0000000000'}
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-16 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Contact Form */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div ref={formRef} className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Send Us a Message</h2>
              <p className="text-gray-500 text-sm mb-6">We'll get back to you within 24 hours.</p>

              {submitted && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-green-900 text-sm">Message Sent!</p>
                    <p className="text-xs text-green-700 mt-0.5">We'll respond within 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                      placeholder="john@example.com" required />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Subject</label>
                  <select value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100" required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Message</label>
                  <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
                    rows={5} placeholder="Tell us how we can help you..." required />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending...</>
                    : <><FaPaperPlane /> Send Message</>
                  }
                </button>
                <p className="text-xs text-gray-500 text-center">🔒 Your information will never be shared.</p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">

            {/* Contact Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
                <FaMapMarkerAlt className="text-purple-600" /> Contact Information
              </h3>
              <div className="space-y-3">
                {[
                  { icon: FaEnvelope, label: 'Email', value: contactInfo?.email || '—', color: 'bg-purple-600', href: `mailto:${contactInfo?.email}` },
                  { icon: FaPhone, label: 'Phone', value: contactInfo?.phone || '—', color: 'bg-orange-500', href: `tel:${contactInfo?.phone}` },
                  { icon: FaMapMarkerAlt, label: 'Office', value: contactInfo?.address || '—', color: 'bg-blue-600', href: null },
                ].map(({ icon: Icon, label, value, color, href }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`w-9 h-9 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="text-white text-xs" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{label}</p>
                      {href ? (
                        <a href={href} className="text-sm font-semibold text-gray-900 hover:text-purple-600 transition-colors">{value}</a>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
                <FaComments className="text-green-600" /> Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                {[['Monday – Friday', '9 AM – 6 PM'], ['Saturday', '10 AM – 4 PM'], ['Sunday', 'Closed']].map(([day, hrs]) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-gray-500">{day}</span>
                    <span className={`font-semibold ${hrs === 'Closed' ? 'text-gray-400' : 'text-gray-900'}`}>{hrs}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2 text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-semibold">We're Online Now</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq-section" className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500">Click any question to see the answer</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion />
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm mb-3">Still have questions?</p>
              <button
                onClick={() => setChatOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 text-sm"
              >
                <FaComments /> Chat with Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="py-16 bg-purple-600">
        <div className="container mx-auto px-4 text-center text-white max-w-4xl">
          <h2 className="text-3xl md:text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Need Immediate Assistance?
          </h2>
          <p className="text-white/80 mb-8">Our support team is standing by to help you succeed.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setChatOpen(true)}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-50 inline-flex items-center gap-2"
            >
              <FaComments /> Start Live Chat →
            </button>
            <a href="tel:+12345678900"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold border-2 border-white/30 hover:bg-white/20 inline-flex items-center gap-2">
              <FaPhone /> Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


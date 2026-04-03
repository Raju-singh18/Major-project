import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import {
  FaMapMarkerAlt, FaCalendar, FaClock, FaUser, FaTicketAlt,
  FaArrowLeft, FaCheckCircle, FaHeart, FaRegHeart, FaShare,
  FaUsers, FaTag
} from 'react-icons/fa';
import ReviewSection from '../components/ReviewSection';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toasts, success, error, removeToast } = useToast();

  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState({});
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showMockPayment, setShowMockPayment] = useState(false);

  useEffect(() => { fetchEvent(); }, [id]);
  useEffect(() => { if (user && event) checkWishlistStatus(); }, [user, event]);

  const checkWishlistStatus = async () => {
    try {
      const { data } = await api.get(`/wishlist/check/${id}`);
      setIsInWishlist(data.isInWishlist);
    } catch {}
  };

  const handleWishlistToggle = async () => {
    if (!user) { navigate('/login'); return; }
    setWishlistLoading(true);
    try {
      const { data } = await api.post('/wishlist/toggle', { eventId: id });
      setIsInWishlist(data.isInWishlist);
      success(data.isInWishlist ? '❤️ Added to wishlist' : 'Removed from wishlist');
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
      setRelatedEvents(data.relatedEvents || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleMockPayment = async (bookingTickets) => {
    try {
      const { data } = await api.post('/bookings/mock-payment', { eventId: event._id, tickets: bookingTickets });
      if (data.success) {
        success('✅ Payment successful! (Test Mode) Redirecting...');
        window.dispatchEvent(new Event('notificationsUpdated'));
        setTimeout(() => navigate('/my-bookings'), 2000);
      }
    } catch (err) {
      error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    if (user.suspended) { error('Your account has been suspended. You cannot book events.'); return; }

    const bookingTickets = Object.entries(tickets)
      .filter(([_, qty]) => qty > 0)
      .map(([ticketType, quantity]) => ({
        ticketType, quantity,
        price: event.ticketTypes.find(t => t.name === ticketType).price
      }));

    if (!bookingTickets.length) { error('Please select at least one ticket'); return; }

    setBookingLoading(true);
    try {
      const { data: orderData } = await api.post('/bookings/create-order', { eventId: event._id, tickets: bookingTickets });
      setBookingLoading(false);

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EventMe',
        description: `Booking for ${event.title}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          setBookingLoading(true);
          try {
            const { data } = await api.post('/bookings/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              eventId: event._id, tickets: bookingTickets
            });
            if (data.success) {
              setBookingLoading(false);
              success('Payment successful! Redirecting...');
              window.dispatchEvent(new Event('notificationsUpdated'));
              setTimeout(() => navigate('/my-bookings'), 2000);
            }
          } catch (err) {
            setBookingLoading(false);
            error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: { name: user.name, email: user.email, contact: user.phone || '' },
        theme: { color: '#7c3aed' },
        modal: {
          ondismiss: () => { setBookingLoading(false); error('Payment cancelled'); }
        }
      });

      razorpay.on('payment.failed', (response) => {
        setBookingLoading(false);
        const reason = response.error?.reason;
        const msg = response.error?.description || 'Payment could not be completed';
        if (reason === 'international_transaction_not_allowed' || msg.toLowerCase().includes('international')) {
          error('International cards not supported. Use the Test Payment button below.');
        } else {
          error(`Payment failed: ${msg}`);
        }
        setShowMockPayment(true);
      });

      razorpay.open();
    } catch (err) {
      setBookingLoading(false);
      error((err.response?.data?.message || 'Payment could not be completed') + ' — use Test Payment below.');
      setShowMockPayment(true);
    }
  };

  const totalAmount = Object.entries(tickets).reduce((sum, [type, qty]) => {
    const t = event?.ticketTypes.find(t => t.name === type);
    return sum + (t?.price || 0) * qty;
  }, 0);
  const totalTickets = Object.values(tickets).reduce((s, q) => s + q, 0);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="h-72 bg-gray-200 animate-pulse"></div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!event) return (
    <div className="min-h-screen pt-28 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Not Found</h2>
        <p className="text-gray-600 mb-6">This event doesn't exist or has been removed.</p>
        <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold">
          <FaArrowLeft /> Browse Events
        </Link>
      </div>
    </div>
  );

  const soldPct = event.totalSeats > 0
    ? Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)
    : 0;

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

        {/* ── Hero Image ─────────────────────────────────────────────────── */}
        <div className="relative h-72 md:h-[420px] overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

          {/* Top bar */}
          <div className="absolute top-20 left-0 right-0 px-4 md:px-8 flex items-center justify-between">
            <Link to="/events" className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30">
              <FaArrowLeft /> Back
            </Link>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                {event.category}
              </span>
              {user && (
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/30"
                >
                  {isInWishlist
                    ? <FaHeart className="text-red-400" />
                    : <FaRegHeart />
                  }
                  <span className="hidden sm:inline">{isInWishlist ? 'Saved' : 'Save'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
            <div className="container mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1.5">
                  <FaCalendar className="text-purple-300" />
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="text-purple-300" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-purple-300" />
                  {event.location.city}, {event.location.country}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content ───────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left — Details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Info cards row */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: FaCalendar, label: 'Date', value: new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }), color: 'from-purple-600 to-indigo-600' },
                  { icon: FaClock, label: 'Time', value: event.time, color: 'from-blue-500 to-cyan-600' },
                  { icon: FaMapMarkerAlt, label: 'Venue', value: `${event.location.venue}, ${event.location.address}`, color: 'from-orange-500 to-red-500' },
                  { icon: FaUser, label: 'Organizer', value: event.organizer.name, color: 'from-green-500 to-emerald-600' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start gap-4">
                    <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">{label}</p>
                      <p className="text-gray-900 font-semibold text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Availability bar */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaUsers className="text-purple-600" />
                    Ticket Availability
                  </div>
                  <span className={`text-sm font-bold ${soldPct >= 80 ? 'text-red-600' : soldPct >= 50 ? 'text-orange-600' : 'text-green-600'}`}>
                    {event.availableSeats} seats left
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${soldPct >= 80 ? 'bg-red-500' : soldPct >= 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${soldPct}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{soldPct}% sold · {event.totalSeats} total seats</p>
              </div>

              {/* About */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>About This Event</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>

              {/* Reviews */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <ReviewSection eventId={event._id} />
              </div>

              {/* Related Events */}
              {relatedEvents.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Similar Events</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {relatedEvents.map((rel) => (
                      <Link key={rel._id} to={`/events/${rel._id}`} className="group border border-gray-200 rounded-xl overflow-hidden hover:border-purple-300">
                        <div className="relative h-36 overflow-hidden">
                          <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <span className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg">
                            {rel.category}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-1 group-hover:text-purple-600">{rel.title}</h3>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1"><FaCalendar /> {new Date(rel.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span className="font-bold text-purple-600">From ${Math.min(...rel.ticketTypes.map(t => t.price))}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-20">
                <h2 className="text-xl font-bold text-gray-900 mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Book Tickets</h2>

                {/* Ticket types */}
                <div className="space-y-3 mb-5">
                  {event.ticketTypes.map((ticket) => {
                    const available = ticket.quantity - ticket.sold;
                    const isAvailable = available > 0;
                    const qty = tickets[ticket.name] || 0;

                    return (
                      <div key={ticket.name} className={`border rounded-xl p-4 ${isAvailable ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900">{ticket.name}</p>
                            <p className={`text-xs font-medium mt-0.5 ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                              {isAvailable ? `${available} available` : 'Sold Out'}
                            </p>
                          </div>
                          <span className="text-xl font-bold text-purple-600">${ticket.price}</span>
                        </div>

                        {isAvailable && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setTickets({ ...tickets, [ticket.name]: Math.max(0, qty - 1) })}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center"
                            >−</button>
                            <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
                            <button
                              onClick={() => setTickets({ ...tickets, [ticket.name]: Math.min(available, qty + 1) })}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold text-gray-700 flex items-center justify-center"
                            >+</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Order summary */}
                {totalTickets > 0 && (
                  <div className="border-t border-gray-100 pt-4 mb-5 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{totalTickets} ticket{totalTickets > 1 ? 's' : ''}</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Service fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-purple-600 text-lg">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Suspended warning */}
                {user?.suspended && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-start gap-2">
                    <span className="text-base">🚫</span>
                    <div>
                      <p className="font-bold">Account Suspended</p>
                      <p className="text-xs mt-0.5">You cannot book events at this time.</p>
                    </div>
                  </div>
                )}

                {/* Payment note */}
                {!user?.suspended && totalTickets > 0 && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl mb-4 text-xs">
                    <p className="font-semibold mb-1">💳 Accepted: UPI · Net Banking · Indian Cards</p>
                    <p className="text-blue-600">⚠️ International cards not supported</p>
                  </div>
                )}

                {/* Book button */}
                <button
                  onClick={handleBooking}
                  disabled={totalTickets === 0 || bookingLoading || user?.suspended}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                  ) : user?.suspended ? '🚫 Account Suspended'
                    : totalTickets === 0 ? 'Select Tickets'
                    : <><FaTicketAlt /> Book {totalTickets} Ticket{totalTickets > 1 ? 's' : ''}</>
                  }
                </button>

                {/* Test payment fallback */}
                {showMockPayment && user && !user.suspended && totalTickets > 0 && (
                  <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-sm font-bold text-orange-800 mb-1">⚠️ Razorpay Payment Failed</p>
                    <p className="text-xs text-orange-700 mb-3">Use Test Payment mode for development.</p>
                    <button
                      onClick={() => {
                        setBookingLoading(true);
                        const bt = Object.entries(tickets)
                          .filter(([_, q]) => q > 0)
                          .map(([ticketType, quantity]) => ({
                            ticketType, quantity,
                            price: event.ticketTypes.find(t => t.name === ticketType).price
                          }));
                        handleMockPayment(bt);
                      }}
                      disabled={bookingLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {bookingLoading
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                        : '🧪 Use Test Payment (Dev Mode)'
                      }
                    </button>
                  </div>
                )}

                {/* Trust indicators */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                  {['Secure payment processing', 'Instant ticket delivery', '24/7 customer support'].map(t => (
                    <div key={t} className="flex items-center gap-2 text-xs text-gray-500">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;

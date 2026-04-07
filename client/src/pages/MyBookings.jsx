import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api, { API_URL } from '../config/api';
import { AuthContext } from '../context/AuthContext';
import {
  FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaCheckCircle,
  FaTimesCircle, FaClock, FaStar, FaEdit, FaPaperPlane,
  FaReceipt, FaDownload, FaFileInvoice
} from 'react-icons/fa';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({});
  const [showReviewForm, setShowReviewForm] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [reviewedEvents, setReviewedEvents] = useState({});
  const [downloadingId, setDownloadingId] = useState(null);
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      const valid = data.filter(b => b.event && b.event._id);
      setBookings(valid);
      const past = valid.filter(b => b.status === 'confirmed' && new Date(b.event.date) < new Date());
      const checks = await Promise.all(
        past.map(b =>
          api.get(`/reviews/event/${b.event._id}`)
            .then(({ data: rd }) => ({ eventId: b.event._id, reviewed: rd.reviews.some(r => r.user._id === user._id || r.user === user._id) }))
            .catch(() => ({ eventId: b.event._id, reviewed: false }))
        )
      );
      const map = {};
      checks.forEach(({ eventId, reviewed }) => { map[eventId] = reviewed; });
      setReviewedEvents(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirmCancelId) return;
    try {
      await api.delete(`/bookings/${confirmCancelId}`);
      success('Booking cancelled successfully');
      setConfirmCancelId(null);
      fetchBookings();
    } catch (err) {
      error('Failed to cancel booking. Please try again.');
    }
  };

  const handleDownloadReceipt = async (bookingId, bookingRef, status) => {
    setDownloadingId(bookingId);
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const res = await fetch(`${API_URL}/bookings/${bookingId}/receipt`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      if (!res.ok) throw new Error('Failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${status === 'cancelled' ? 'cancellation' : 'receipt'}-${bookingRef}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success('📄 Receipt downloaded!');
    } catch {
      error('Failed to download receipt. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleReviewSubmit = async (eventId, bookingId) => {
    const review = reviewData[bookingId];
    if (!review?.rating || !review?.comment) { error('Please provide both rating and comment'); return; }
    if (review.comment.length < 10) { error('Review must be at least 10 characters'); return; }
    try {
      await api.post('/reviews', { eventId, rating: review.rating, comment: review.comment });
      success('Review submitted successfully!');
      setShowReviewForm({ ...showReviewForm, [bookingId]: false });
      setReviewData({ ...reviewData, [bookingId]: { rating: 0, comment: '' } });
      setReviewedEvents({ ...reviewedEvents, [eventId]: true });
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const isPastEvent = d => new Date(d) < new Date();
  const hasUserReviewed = id => !!reviewedEvents[id];
  const filteredBookings = filterStatus === 'all' ? bookings : bookings.filter(b => b.status === filterStatus);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    upcoming: bookings.filter(b => b.status === 'confirmed' && !isPastEvent(b.event.date)).length,
    past: bookings.filter(b => b.status === 'confirmed' && isPastEvent(b.event.date)).length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-28 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium text-lg">Loading your bookings...</p>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <FaTicketAlt className="text-2xl text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                My <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Bookings</span>
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Manage and track all your event bookings</p>
          </div>

          {/* Stats */}
          {bookings.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
              {[
                { label: 'Total', value: stats.total, color: 'text-gray-900' },
                { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
                { label: 'Pending', value: stats.pending, color: 'text-yellow-600' },
                { label: 'Cancelled', value: stats.cancelled, color: 'text-red-600' },
                { label: 'Upcoming', value: stats.upcoming, color: 'text-blue-600' },
                { label: 'Past', value: stats.past, color: 'text-purple-600' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filter Tabs */}
          {bookings.length > 0 && (
            <div className="mb-8 flex justify-center">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-1 inline-flex gap-1 flex-wrap">
                {[
                  { id: 'all', label: 'All', count: stats.total },
                  { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                  { id: 'pending', label: 'Pending', count: stats.pending },
                  { id: 'cancelled', label: 'Cancelled', count: stats.cancelled },
                ].map(f => (
                  <button key={f.id} onClick={() => setFilterStatus(f.id)}
                    className={`px-5 py-2.5 rounded-lg font-semibold transition-colors text-sm ${filterStatus === f.id ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-6">🎫</div>
              <p className="text-gray-900 text-2xl mb-2 font-semibold">{bookings.length === 0 ? 'No Bookings Yet' : 'No bookings found'}</p>
              <p className="text-gray-600 mb-8">{bookings.length === 0 ? 'Start exploring amazing events and book your tickets' : 'Try changing the filter'}</p>
              {bookings.length === 0 && (
                <Link to="/events" className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
                  <FaCalendar /> Browse Events
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map(booking => (
                <div key={booking._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors">

                  {/* Card Header */}
                  <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.event.title}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaReceipt className="text-purple-400" />
                        <span className="font-mono font-semibold tracking-wide">{booking.bookingReference}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${
                      booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200'
                      : booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {booking.status === 'confirmed' && <FaCheckCircle />}
                      {booking.status === 'pending' && <FaClock />}
                      {booking.status === 'cancelled' && <FaTimesCircle />}
                      <span className="uppercase tracking-wide">{booking.status}</span>
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">

                      {/* Event Details */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Event Details</h4>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <FaCalendar className="text-purple-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
                            <p className="text-gray-900 font-semibold text-sm">{new Date(booking.event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            <p className="text-xs text-gray-500">{booking.event.time}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <FaMapMarkerAlt className="text-orange-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 mb-0.5">Venue</p>
                            <p className="text-gray-900 font-semibold text-sm">{booking.event.location.venue}</p>
                            <p className="text-xs text-gray-500">{booking.event.location.city}, {booking.event.location.country}</p>
                          </div>
                        </div>
                      </div>

                      {/* Tickets */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tickets</h4>
                        {booking.tickets.map((ticket, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <div>
                              <p className="text-gray-900 font-semibold text-sm">{ticket.ticketType}</p>
                              <p className="text-xs text-gray-500">Qty: {ticket.quantity}</p>
                            </div>
                            <p className={`font-bold text-sm ${ticket.price === 0 ? 'text-green-600' : 'text-purple-600'}`}>
                              {ticket.price === 0 ? 'FREE' : `₹${(ticket.price * ticket.quantity).toFixed(2)}`}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Payment */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment</h4>
                        <div className={`rounded-xl p-4 border-2 ${booking.totalAmount === 0 ? 'bg-green-50 border-green-200' : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'}`}>
                          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                          <p className={`text-3xl font-bold mb-2 ${booking.totalAmount === 0 ? 'text-green-700' : 'text-gray-900'}`}>
                            {booking.totalAmount === 0 ? 'FREE' : `₹${booking.totalAmount}`}
                          </p>
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${booking.status === 'cancelled' ? 'text-red-600' : booking.totalAmount === 0 ? 'text-green-700' : 'text-green-600'}`}>
                            {booking.status === 'cancelled' ? <FaTimesCircle /> : <FaCheckCircle />}
                            {booking.status === 'cancelled' ? 'Cancelled' : booking.totalAmount === 0 ? 'Free Registration' : 'Payment Confirmed'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── Receipt Section ─────────────────────────────────── */}
                    {(booking.status === 'confirmed' || booking.status === 'cancelled') && (
                      <div className="mb-6 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 overflow-hidden">
                        {/* Ticket stub top */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-dashed border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                              <FaFileInvoice className="text-purple-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                {booking.status === 'cancelled' ? 'Cancellation Receipt' : 'Booking Receipt'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.status === 'cancelled'
                                  ? 'Your cancellation confirmation with refund details'
                                  : 'Your official booking confirmation with ticket details'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownloadReceipt(booking._id, booking.bookingReference, booking.status)}
                            disabled={downloadingId === booking._id}
                            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 flex-shrink-0"
                          >
                            {downloadingId === booking._id ? (
                              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
                            ) : (
                              <><FaDownload /> Download PDF</>
                            )}
                          </button>
                        </div>

                        {/* Mini receipt preview */}
                        <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <p className="text-gray-400 uppercase tracking-wider mb-1">Reference</p>
                            <p className="font-mono font-bold text-purple-700">{booking.bookingReference}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 uppercase tracking-wider mb-1">Event Date</p>
                            <p className="font-semibold text-gray-800">{new Date(booking.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 uppercase tracking-wider mb-1">Tickets</p>
                            <p className="font-semibold text-gray-800">{booking.tickets.reduce((s, t) => s + t.quantity, 0)} ticket{booking.tickets.reduce((s, t) => s + t.quantity, 0) !== 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 uppercase tracking-wider mb-1">Total</p>
                            <p className={`font-bold ${booking.totalAmount === 0 ? 'text-green-600' : 'text-purple-700'}`}>
                              {booking.totalAmount === 0 ? 'FREE' : `₹${booking.totalAmount}`}
                            </p>
                          </div>
                        </div>

                        {/* Cancellation refund note */}
                        {booking.status === 'cancelled' && booking.totalAmount > 0 && (
                          <div className="mx-5 mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
                            <span className="text-base flex-shrink-0">⏳</span>
                            <span>Refund of <strong>₹{booking.totalAmount}</strong> will be processed within 5–7 business days to your original payment method.</span>
                          </div>
                        )}
                        {booking.status === 'cancelled' && booking.totalAmount === 0 && (
                          <div className="mx-5 mb-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-base flex-shrink-0">ℹ️</span>
                            <span>This was a free event — no refund required. Your spot has been released.</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-100">
                      <Link to={`/events/${booking.event._id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors text-sm">
                        <FaCalendar /> View Event
                      </Link>

                      {booking.status === 'confirmed' && !isPastEvent(booking.event.date) && (
                        <button onClick={() => setConfirmCancelId(booking._id)}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors text-sm">
                          <FaTimesCircle /> Cancel Booking
                        </button>
                      )}

                      {booking.status === 'confirmed' && isPastEvent(booking.event.date) && !hasUserReviewed(booking.event._id) && (
                        <button onClick={() => setShowReviewForm({ ...showReviewForm, [booking._id]: !showReviewForm[booking._id] })}
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors text-sm">
                          <FaStar /> {showReviewForm[booking._id] ? 'Hide Review' : 'Write Review'}
                        </button>
                      )}
                    </div>

                    {/* Review Section */}
                    {booking.status === 'confirmed' && isPastEvent(booking.event.date) && (
                      <div className="mt-5 pt-5 border-t border-gray-100">
                        {hasUserReviewed(booking.event._id) ? (
                          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <FaCheckCircle className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">Review Submitted</p>
                              <p className="text-xs text-green-700">Thank you for sharing your experience!</p>
                            </div>
                          </div>
                        ) : showReviewForm[booking._id] ? (
                          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <FaEdit className="text-amber-600" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">Share Your Experience</p>
                                <p className="text-xs text-amber-700">Help others by reviewing this event</p>
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Rating</label>
                              <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-amber-200">
                                {[1,2,3,4,5].map(star => (
                                  <button key={star} type="button"
                                    onClick={() => setReviewData({ ...reviewData, [booking._id]: { ...reviewData[booking._id], rating: star } })}
                                    className="hover:scale-110 transition-transform">
                                    <FaStar className={`text-2xl ${(reviewData[booking._id]?.rating || 0) >= star ? 'text-amber-400' : 'text-gray-300'}`} />
                                  </button>
                                ))}
                                {reviewData[booking._id]?.rating > 0 && (
                                  <span className="ml-2 font-bold text-amber-500">{reviewData[booking._id].rating}/5</span>
                                )}
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Your Review</label>
                              <textarea
                                value={reviewData[booking._id]?.comment || ''}
                                onChange={e => setReviewData({ ...reviewData, [booking._id]: { ...reviewData[booking._id], comment: e.target.value } })}
                                placeholder="Share your thoughts about the event..."
                                rows="4"
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 resize-none text-sm"
                              />
                              <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleReviewSubmit(booking.event._id, booking._id)}
                                disabled={!reviewData[booking._id]?.rating || (reviewData[booking._id]?.comment || '').length < 10}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                                <FaPaperPlane /> Submit Review
                              </button>
                              <button
                                onClick={() => setShowReviewForm({ ...showReviewForm, [booking._id]: false })}
                                className="px-5 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 text-sm">
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-5 text-center cursor-pointer hover:border-amber-400 transition-colors"
                            onClick={() => setShowReviewForm({ ...showReviewForm, [booking._id]: true })}>
                            <FaStar className="text-amber-400 text-2xl mx-auto mb-2" />
                            <p className="font-bold text-gray-900 text-sm mb-1">Event Completed — Share Your Experience</p>
                            <p className="text-xs text-gray-500">Help others discover great events</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirm Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Cancel Booking?</h3>
            <p className="text-gray-500 text-center text-sm mb-6">Your tickets will be released and this action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleCancel}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 flex items-center justify-center gap-2">
                <FaTimesCircle /> Yes, Cancel
              </button>
              <button onClick={() => setConfirmCancelId(null)}
                className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400">
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookings;

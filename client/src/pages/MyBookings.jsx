import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { FaCalendar, FaMapMarkerAlt, FaTicketAlt, FaCheckCircle, FaTimesCircle, FaClock, FaStar, FaEdit, FaPaperPlane, FaReceipt } from 'react-icons/fa';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({});
  const [showReviewForm, setShowReviewForm] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');
  const { toasts, removeToast, success, error } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      const validBookings = data.filter(booking => booking.event && booking.event._id);
      setBookings(validBookings);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/${id}`);
        success('Booking cancelled successfully!');
        fetchBookings();
      } catch (err) {
        error('Failed to cancel booking. Please try again.');
      }
    }
  };

  const handleReviewSubmit = async (eventId, bookingId) => {
    const review = reviewData[bookingId];
    if (!review || !review.rating || !review.comment) {
      error('Please provide both rating and comment');
      return;
    }

    if (review.comment.length < 10) {
      error('Review comment must be at least 10 characters');
      return;
    }

    try {
      await api.post(`/events/${eventId}/reviews`, {
        rating: review.rating,
        comment: review.comment
      });
      success('Review submitted successfully!');
      setShowReviewForm({ ...showReviewForm, [bookingId]: false });
      setReviewData({ ...reviewData, [bookingId]: { rating: 0, comment: '' } });
      fetchBookings();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const setRating = (bookingId, rating) => {
    setReviewData({
      ...reviewData,
      [bookingId]: { ...reviewData[bookingId], rating }
    });
  };

  const setComment = (bookingId, comment) => {
    setReviewData({
      ...reviewData,
      [bookingId]: { ...reviewData[bookingId], comment }
    });
  };

  const toggleReviewForm = (bookingId) => {
    setShowReviewForm({
      ...showReviewForm,
      [bookingId]: !showReviewForm[bookingId]
    });
  };

  const isPastEvent = (eventDate) => {
    return new Date(eventDate) < new Date();
  };

  const hasUserReviewed = (event) => {
    if (!event || !event.reviews) return false;
    return event.reviews.some(review => 
      review.user?._id === user.id || review.user === user.id
    );
  };

  const getFilteredBookings = () => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter(booking => booking.status === filterStatus);
  };

  const filteredBookings = getFilteredBookings();

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
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
        {/* Header Section */}
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

        {/* Stats Cards */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600 font-medium">Total</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.confirmed}</div>
              <div className="text-sm text-gray-600 font-medium">Confirmed</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
              <div className="text-sm text-gray-600 font-medium">Pending</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">{stats.cancelled}</div>
              <div className="text-sm text-gray-600 font-medium">Cancelled</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stats.upcoming}</div>
              <div className="text-sm text-gray-600 font-medium">Upcoming</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats.past}</div>
              <div className="text-sm text-gray-600 font-medium">Past</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {bookings.length > 0 && (
          <div className="mb-8 flex justify-center">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-1 inline-flex gap-1">
              {[
                { id: 'all', label: 'All', count: stats.total },
                { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                { id: 'pending', label: 'Pending', count: stats.pending },
                { id: 'cancelled', label: 'Cancelled', count: stats.cancelled },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    filterStatus === filter.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-6">🎫</div>
            <p className="text-gray-900 text-2xl mb-2 font-semibold">
              {bookings.length === 0 ? 'No Bookings Yet' : 'No bookings found'}
            </p>
            <p className="text-gray-600 mb-8">
              {bookings.length === 0 
                ? 'Start exploring amazing events and book your tickets' 
                : 'Try changing the filter to see other bookings'}
            </p>
            {bookings.length === 0 && (
              <Link 
                to="/events" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                <FaCalendar />
                Browse Events
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors">
                {/* Card Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{booking.event.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaReceipt className="text-purple-500" />
                        <span className="font-mono font-semibold">{booking.bookingReference}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border-2 ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : booking.status === 'pending' 
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {booking.status === 'confirmed' && <FaCheckCircle />}
                      {booking.status === 'pending' && <FaClock />}
                      {booking.status === 'cancelled' && <FaTimesCircle />}
                      <span className="uppercase tracking-wide">{booking.status}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    {/* Event Details */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Event Details</h4>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <FaCalendar className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                          <p className="text-gray-900 font-semibold">{new Date(booking.event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p className="text-sm text-gray-600">{booking.event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <FaMapMarkerAlt className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Location</p>
                          <p className="text-gray-900 font-semibold">{booking.event.location.venue}</p>
                          <p className="text-sm text-gray-600">{booking.event.location.city}, {booking.event.location.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tickets</h4>
                      <div className="space-y-2">
                        {booking.tickets.map((ticket, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div>
                              <p className="text-gray-900 font-semibold">{ticket.ticketType}</p>
                              <p className="text-sm text-gray-600">Qty: {ticket.quantity}</p>
                            </div>
                            <p className="text-purple-600 font-bold">${ticket.price * ticket.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Payment</h4>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border-2 border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-4xl font-bold text-gray-900 mb-2">${booking.totalAmount}</p>
                        <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                          <FaCheckCircle />
                          <span>Payment Confirmed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <Link
                      to={`/events/${booking.event._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                    >
                      <FaCalendar />
                      View Event Details
                    </Link>
                    
                    {booking.status === 'confirmed' && !isPastEvent(booking.event.date) && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                      >
                        <FaTimesCircle />
                        Cancel Booking
                      </button>
                    )}

                    {booking.status === 'confirmed' && isPastEvent(booking.event.date) && !hasUserReviewed(booking.event) && (
                      <button
                        onClick={() => toggleReviewForm(booking._id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                      >
                        <FaStar />
                        {showReviewForm[booking._id] ? 'Hide Review' : 'Write Review'}
                      </button>
                    )}
                  </div>

                  {/* Review Section */}
                  {booking.status === 'confirmed' && isPastEvent(booking.event.date) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      {hasUserReviewed(booking.event) ? (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                              <FaCheckCircle className="text-green-600 text-xl" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">Review Submitted</h4>
                              <p className="text-sm text-green-700">Thank you for sharing your experience!</p>
                            </div>
                          </div>
                          {booking.event.reviews?.filter(r => r.user?._id === user.id || r.user === user.id).map((review, idx) => (
                            <div key={idx} className="bg-white rounded-lg p-4 border border-green-200">
                              <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={`${i < review.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                                ))}
                                <span className="ml-2 text-gray-900 font-semibold">{review.rating}/5</span>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : showReviewForm[booking._id] ? (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                              <FaEdit className="text-amber-600 text-xl" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">Share Your Experience</h4>
                              <p className="text-sm text-amber-700">Help others by reviewing this event</p>
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                              Rate Your Experience
                            </label>
                            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-amber-200">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(booking._id, star)}
                                  className="hover:scale-110 transition-transform"
                                >
                                  <FaStar
                                    className={`text-3xl ${
                                      (reviewData[booking._id]?.rating || 0) >= star
                                        ? 'text-amber-400'
                                        : 'text-gray-300 hover:text-amber-300'
                                    }`}
                                  />
                                </button>
                              ))}
                              {reviewData[booking._id]?.rating > 0 && (
                                <span className="ml-3 text-2xl font-bold text-amber-500">
                                  {reviewData[booking._id].rating}/5
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Comment */}
                          <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                              Your Review
                            </label>
                            <textarea
                              value={reviewData[booking._id]?.comment || ''}
                              onChange={(e) => setComment(booking._id, e.target.value)}
                              placeholder="Share your thoughts about the event, venue, organization, and overall experience..."
                              rows="5"
                              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-colors resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">Minimum 10 characters</p>
                          </div>

                          {/* Submit Button */}
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleReviewSubmit(booking.event._id, booking._id)}
                              disabled={!reviewData[booking._id]?.rating || !reviewData[booking._id]?.comment || reviewData[booking._id]?.comment.length < 10}
                              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FaPaperPlane />
                              Submit Review
                            </button>
                            <button
                              onClick={() => toggleReviewForm(booking._id)}
                              className="px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-6 text-center hover:border-amber-400 transition-colors cursor-pointer" onClick={() => toggleReviewForm(booking._id)}>
                          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                            <FaStar className="text-amber-500 text-2xl" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">Event Completed</h4>
                          <p className="text-sm text-gray-600 mb-4">Share your experience and help others discover great events</p>
                          <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                            <FaStar />
                            Write a Review
                          </button>
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
    </>
  );
};

export default MyBookings;

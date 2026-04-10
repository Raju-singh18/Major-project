import { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { FaStar, FaEdit, FaTrash, FaLock } from 'react-icons/fa';

const ReviewSection = ({ eventId, eventDate }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Derived state
  const isEventPast = eventDate ? new Date(eventDate) < new Date() : false;
  const userReview = user ? reviews.find((r) => r.user._id === user._id) : null;
  const canWriteReview = user && isEventPast && !userReview;

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reviews/event/${eventId}`);
      setReviews(data.reviews);
      setAvgRating(Number(data.avgRating)); // ensure it's always a number
      setTotalReviews(data.totalReviews);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (editingId) {
        await api.put(`/reviews/${editingId}`, formData);
      } else {
        await api.post('/reviews', { eventId, ...formData });
      }
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      setEditingId(null);
      await fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review) => {
    setFormData({ rating: review.rating, comment: review.comment });
    setEditingId(review._id);
    setShowForm(true);
    // scroll to form
    setTimeout(() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleDelete = (id) => setConfirmDeleteId(id);

  const confirmDelete = async () => {
    try {
      await api.delete(`/reviews/${confirmDeleteId}`);
      setConfirmDeleteId(null);
      await fetchReviews();
    } catch {
      setError('Failed to delete review');
    }
  };

  const renderStars = (rating, interactive = false, onSelect = null) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        onClick={interactive ? () => onSelect(i + 1) : undefined}
        className={[
          i < rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300',
          interactive ? 'cursor-pointer text-3xl sm:text-4xl ' : '',
        ].join(' ')}
      />
    ));
  };

  const ratingLabel = (r) => ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][r] || '';

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-xl"></div>
        <div className="h-24 bg-gray-100 rounded-2xl"></div>
        <div className="h-24 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-2xl sm:text-3xl font-bold text-dark-900 mb-2">Reviews & Ratings</h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">{renderStars(Math.round(avgRating))}</div>
              <span className="text-2xl font-bold text-dark-900">{avgRating.toFixed(1)}</span>
              <span className="text-dark-600 font-medium">
                ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {/* CTA — only show if eligible */}
        {canWriteReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2"
          >
            <FaEdit /> Write a Review
          </button>
        )}

        {/* Explain why they can't review */}
        {user && !isEventPast && (
          <div className="flex items-center gap-2 text-sm text-dark-500 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl">
            <FaLock className="text-gray-400" />
            Reviews open after the event
          </div>
        )}
        {user && isEventPast && userReview && !showForm && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
            ✅ You've reviewed this event
          </div>
        )}
      </div>

      {/* ── Review Form ────────────────────────────────────────────────────── */}
      {showForm && (
        <div
          id="review-form"
          className="bg-purple-50 border-2 border-primary-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-dark-900 mb-6 flex items-center gap-2">
            <FaEdit className="text-primary-500" />
            {editingId ? 'Edit Your Review' : 'Write a Review'}
          </h3>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-dark-900 mb-3 uppercase tracking-wider">
                Your Rating
              </label>
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border-2 border-gray-200">
                {renderStars(formData.rating, true, (star) =>
                  setFormData({ ...formData, rating: star })
                )}
                <span className="ml-2 text-lg font-bold text-dark-900">
                  {formData.rating}/5 — {ratingLabel(formData.rating)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark-900 mb-3 uppercase tracking-wider">
                Your Review
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-dark-900 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-colors outline-none resize-none placeholder-gray-400"
                rows="5"
                placeholder="Share your experience — what did you enjoy? What could be improved?"
                required
                minLength={10}
                maxLength={1000}
              />
              <p className="text-xs text-dark-500 mt-2">
                {formData.comment.length}/1000 characters · minimum 10
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={submitting || formData.comment.length < 10}
                className="flex-1 px-8 py-3.5 bg-purple-600 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><FaStar /> {editingId ? 'Update' : 'Submit'} Review</>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ rating: 5, comment: '' });
                  setError('');
                }}
                className="px-8 py-3.5 bg-white text-dark-700 rounded-xl font-bold border-2 border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Review List ────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isOwn = user && review.user._id === user._id;
          return (
            <div
              key={review._id}
              className={`bg-white border-2 rounded-2xl p-5 sm:p-6 transition-colors ${
                isOwn ? 'border-primary-300 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-dark-900 text-base sm:text-lg">{review.user.name}</span>
                      {isOwn && (
                        <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                      <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                      <span className="text-base font-bold text-dark-900">{review.rating}/5</span>
                      <span className="text-xs sm:text-sm text-dark-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {isOwn && (
                  <div className="flex gap-2 self-start">
                    <button
                      onClick={() => handleEdit(review)}
                      className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 border-2 border-primary-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 flex items-center justify-center transition-colors"
                      title="Edit review"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="w-9 h-9 rounded-lg bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-colors"
                      title="Delete review"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-dark-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
            </div>
          );
        })}
      </div>

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {reviews.length === 0 && !showForm && (
        <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-5xl sm:text-6xl mb-4">⭐</div>
          <h3 className="text-xl sm:text-2xl font-bold text-dark-900 mb-2">No Reviews Yet</h3>
          {isEventPast ? (
            <>
              <p className="text-dark-600 mb-6 text-sm sm:text-base">Be the first to share your experience!</p>
              {canWriteReview && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg transition-colors"
                >
                  <FaEdit /> Write First Review
                </button>
              )}
            </>
          ) : (
            <p className="text-dark-600 text-sm sm:text-base">Reviews will be available after the event.</p>
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Review?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">
                Delete
              </button>
              <button onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;


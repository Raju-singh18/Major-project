import { useState, useEffect, useContext } from 'react';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';

const ReviewSection = ({ eventId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/event/${eventId}`);
      setReviews(data.reviews);
      setAvgRating(data.avgRating);
      setTotalReviews(data.totalReviews);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login to leave a review');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/reviews/${editingId}`, formData);
      } else {
        await api.post('/reviews', { eventId, ...formData });
      }
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      setEditingId(null);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEdit = (review) => {
    setFormData({ rating: review.rating, comment: review.comment });
    setEditingId(review._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}`);
        fetchReviews();
      } catch (error) {
        alert('Failed to delete review');
      }
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 mb-2">Reviews & Ratings</h2>
          {totalReviews > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">{renderStars(Math.round(avgRating))}</div>
              <span className="text-2xl font-bold text-dark-900">{avgRating.toFixed(1)}</span>
              <span className="text-dark-600 font-medium">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
          >
            <FaEdit />
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
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
              <label className="block text-sm font-bold text-dark-900 mb-3 uppercase tracking-wider">Your Rating</label>
              <div className="flex items-center gap-3 bg-white rounded-xl p-4 border-2 border-gray-200">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="text-3xl sm:text-4xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <FaStar
                      className={star <= formData.rating ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-300 hover:text-yellow-200'}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-2xl font-bold text-dark-900">{formData.rating}/5</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-dark-900 mb-3 uppercase tracking-wider">Your Review</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 text-dark-900 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none resize-none placeholder-gray-400"
                rows="5"
                placeholder="Share your experience with this event... What did you enjoy? What could be improved?"
                required
              />
              <p className="text-xs text-dark-500 mt-2">Be specific and helpful to other attendees</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 px-8 py-3.5 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaStar />
                {editingId ? 'Update' : 'Submit'} Review
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ rating: 5, comment: '' });
                }}
                className="px-8 py-3.5 bg-white text-dark-700 rounded-xl font-bold border-2 border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:border-primary-300 transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex items-start gap-3 sm:gap-4 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg flex-shrink-0">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-dark-900 text-base sm:text-lg mb-1">{review.user.name}</div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                    <span className="text-lg font-bold text-dark-900">{review.rating}/5</span>
                    <span className="text-xs sm:text-sm text-dark-500">
                      {new Date(review.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {user && review.user._id === user._id && (
                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => handleEdit(review)}
                    className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 border-2 border-primary-200 hover:bg-primary-500 hover:text-white hover:border-primary-500 flex items-center justify-center transition-all"
                    title="Edit review"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="w-9 h-9 rounded-lg bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all"
                    title="Delete review"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
            <p className="text-dark-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && !showForm && (
        <div className="text-center py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-primary-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="text-5xl sm:text-6xl mb-4">⭐</div>
          <h3 className="text-xl sm:text-2xl font-bold text-dark-900 mb-2">No Reviews Yet</h3>
          <p className="text-dark-600 mb-6 text-sm sm:text-base">Be the first to share your experience!</p>
          {user && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <FaEdit />
              Write First Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

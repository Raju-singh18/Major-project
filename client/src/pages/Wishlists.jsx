import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import { FaHeart, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaCalendar, FaArrowRight, FaTicketAlt } from 'react-icons/fa';

const Wishlists = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toasts, success, error, removeToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/wishlist');
      setWishlist(data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (eventId) => {
    try {
      await api.post('/wishlist/toggle', { eventId });
      setWishlist(wishlist.filter(event => event._id !== eventId));
      success('🗑️ Event removed from wishlist');
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      error('Failed to remove from wishlist');
    }
  };

  const handleClearWishlist = async () => {
    try {
      await api.delete('/wishlist/clear');
      setWishlist([]);
      setShowClearModal(false);
      success('✨ Wishlist cleared successfully!');
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      error('Failed to clear wishlist');
    }
  };

  const WishlistCard = ({ event }) => {
    const minPrice = event.ticketTypes && event.ticketTypes.length > 0 
      ? Math.min(...event.ticketTypes.map(t => t.price))
      : event.price || 0;

    return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors">
        <Link to={`/events/${event._id}`}>
          <div className="relative h-64 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Remove Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFromWishlist(event._id);
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Remove from wishlist"
            >
              <FaTrash className="text-sm" />
            </button>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/95 rounded-full text-gray-800 font-semibold text-xs">
                {event.category}
              </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                {event.title}
              </h3>
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-white text-sm">
                  <FaCalendar className="text-purple-300" />
                  <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-white text-sm">
                  <FaMapMarkerAlt className="text-purple-300" />
                  <span className="line-clamp-1">{event.location?.city || 'TBA'}, {event.location?.country || ''}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/30">
                <div>
                  <span className="text-white/80 text-xs">From</span>
                  <div className="text-white font-bold text-xl">${minPrice}</div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm">
                  Book <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white border border-gray-200 rounded-2xl overflow-hidden h-64">
      <div className="bg-gray-200 h-full" />
    </div>
  );

  const stats = {
    total: wishlist.length,
    categories: new Set(wishlist.map(e => e.category)).size,
    upcoming: wishlist.filter(e => new Date(e.date) >= new Date()).length,
    past: wishlist.filter(e => new Date(e.date) < new Date()).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-white text-2xl" />
          </div>
          <p className="text-gray-700 font-medium text-lg">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <FaHeart className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  My <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Wishlist</span>
                </h1>
              </div>
            </div>

            {wishlist.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <FaTrash />
                Clear All
              </button>
            )}
          </div>
          <p className="text-gray-600 text-lg">
            {wishlist.length === 0 
              ? 'Start adding events you love!' 
              : `${wishlist.length} event${wishlist.length !== 1 ? 's' : ''} saved`
            }
          </p>
        </div>

        {/* Stats Cards */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600 font-medium">Saved Events</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{stats.categories}</div>
              <div className="text-sm text-gray-600 font-medium">Categories</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{stats.upcoming}</div>
              <div className="text-sm text-gray-600 font-medium">Upcoming</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-gray-600 mb-1">{stats.past}</div>
              <div className="text-sm text-gray-600 font-medium">Past Events</div>
            </div>
          </div>
        )}

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-28 h-28 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaHeart className="text-red-400 text-5xl" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Discover amazing events and save your favorites by clicking the heart icon on any event card.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
              >
                <FaCalendarAlt />
                Browse Events
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Events Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {wishlist.map((event) => (
                <WishlistCard key={event._id} event={event} />
              ))}
            </div>

            {/* CTA Section */}
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Book?
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Turn your wishlist into unforgettable experiences
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/events"
                  className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  Browse More Events <FaArrowRight />
                </Link>
                <Link
                  to="/my-bookings"
                  className="px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center gap-2"
                >
                  <FaTicketAlt />
                  My Bookings
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Clear Wishlist Modal */}
        {showClearModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaTrash className="text-white text-3xl" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Clear Wishlist?
              </h3>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                Are you sure you want to remove all <span className="font-bold text-red-500">{wishlist.length}</span> events from your wishlist? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Wishlists;

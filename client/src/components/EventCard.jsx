import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendar, FaTicketAlt, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';

const EventCard = ({ event, onWishlistChange, showToast }) => {
  const { user } = useContext(AuthContext);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && event?._id) {
      checkWishlistStatus();
    }
  }, [user, event?._id]);

  const checkWishlistStatus = async () => {
    if (!event?._id) return;
    
    try {
      const { data } = await api.get(`/wishlist/check/${event._id}`);
      setIsInWishlist(data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (showToast) {
        showToast('Please login to add events to wishlist', 'error');
      }
      return;
    }

    if (!event?._id) {
      console.error('Event ID is missing');
      return;
    }

    console.log('Toggling wishlist for event:', event._id);

    setIsLoading(true);
    try {
      const { data } = await api.post('/wishlist/toggle', { eventId: event._id });
      console.log('Toggle response:', data);
      
      setIsInWishlist(data.isInWishlist);
      
      // Show success message
      const message = data.isInWishlist 
        ? `✨ ${event.title} added to wishlist!` 
        : `🗑️ ${event.title} removed from wishlist`;
      
      if (showToast) {
        showToast(message, 'success');
      }
      
      if (onWishlistChange) {
        onWishlistChange(event._id, data.isInWishlist);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      console.error('Error response:', error.response);
      
      const errorMessage = error.response?.data?.message || 'Failed to update wishlist. Please try again.';
      
      if (showToast) {
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const minPrice = event.ticketTypes && event.ticketTypes.length > 0 
    ? Math.min(...event.ticketTypes.map(t => t.price))
    : event.price || 0;

  return (
    <Link to={`/events/${event._id}`} className="block group">
      <div className="glass-card rounded-3xl overflow-hidden hover-lift transition-colors duration-500 border border-gray-100">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-purple-600 flex items-center justify-center">
              <FaCalendar className="text-white text-6xl opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Wishlist Button */}
          {user && (
            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-lg z-10 group/wishlist"
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? (
                <FaHeart className="text-red-500 text-lg animate-pulse" />
              ) : (
                <FaRegHeart className="text-gray-700 text-lg group-hover/wishlist:text-red-500 transition-colors" />
              )}
            </button>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className="glass px-4 py-2 rounded-full text-white font-semibold text-sm backdrop-blur-xl">
              {event.category}
            </span>
          </div>
          
          {/* Date Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="glass px-4 py-2 rounded-xl text-white font-bold text-sm backdrop-blur-xl">
              {formatDate(event.date)}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-dark-900 mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {event.title}
          </h3>
          
          <p className="text-dark-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          
          {/* Meta Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-dark-600 text-sm">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaClock className="text-white text-xs" />
              </div>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-dark-600 text-sm">
              <div className="w-8 h-8 bg-violet-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-white text-xs" />
              </div>
              <span className="line-clamp-1">{event.location?.city || 'Location'}, {event.location?.country || 'Country'}</span>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <FaTicketAlt className="text-dark-400 text-sm" />
              <span className="text-xs font-medium text-dark-500">
                {event.availableSeats > 0 ? (
                  <>{event.availableSeats} seats left</>
                ) : (
                  <span className="text-red-500">Sold Out</span>
                )}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-dark-500 mb-0.5">From</div>
              <div className="text-primary-500 font-bold text-xl">
                {event.isFree ? 'Free' : `₹${minPrice}`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;


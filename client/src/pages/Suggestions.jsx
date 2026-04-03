import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import {
  FaMapMarkerAlt, FaCalendar, FaFire, FaHeart,
  FaArrowRight, FaTrophy, FaLightbulb, FaChartLine,
  FaShare, FaBookmark, FaFilter, FaRandom
} from 'react-icons/fa';

export default function Suggestions() {
  const { user } = useContext(AuthContext);
  const { toasts, success, error, removeToast } = useToast();
  const [suggestions, setSuggestions] = useState({
    trending: [],
    nearYou: [],
    basedOnInterests: [],
    upcoming: [],
    popular: []
  });
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fav = localStorage.getItem('favorites');
    if (fav) setFavorites(JSON.parse(fav));
    const bm = localStorage.getItem('bookmarks');
    if (bm) setBookmarked(JSON.parse(bm));
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const [trendingRes, upcomingRes, popularRes] = await Promise.all([
        api.get('/events', { params: { limit: 8, sortBy: 'trending' } }),
        api.get('/events', { params: { limit: 8, sortBy: 'date' } }),
        api.get('/events', { params: { limit: 8, sortBy: 'popular' } })
      ]);

      const processEvents = (events) => events.map(e => ({
        ...e,
        minPrice: e.minPrice || (Array.isArray(e.ticketTypes) && e.ticketTypes.length 
          ? Math.min(...e.ticketTypes.map(t => t.price)) 
          : 0)
      }));

      setSuggestions({
        trending: processEvents(trendingRes.data),
        nearYou: processEvents(upcomingRes.data.slice(0, 4)),
        basedOnInterests: processEvents(popularRes.data.slice(0, 4)),
        upcoming: processEvents(upcomingRes.data),
        popular: processEvents(popularRes.data)
      });
    } catch (err) {
      console.error('Error fetching suggestions', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    if (!user) {
      error('Please login to add events to wishlist');
      return;
    }

    try {
      const { data } = await api.post('/wishlist/toggle', { eventId: id });
      
      if (data.isInWishlist) {
        setFavorites([...favorites, id]);
        success('✨ Event added to wishlist!');
      } else {
        setFavorites(favorites.filter(x => x !== id));
        success('🗑️ Event removed from wishlist');
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const toggleBookmark = (id) => {
    setBookmarked(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  };

  const shareEvent = async (event) => {
    const url = `${window.location.origin}/events/${event._id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text: event.description, url });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const SuggestionCard = ({ event, index }) => (
    <Link
      to={`/events/${event._id}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(event._id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              favorites.includes(event._id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
            title="Add to favorites"
          >
            <FaHeart className="text-sm" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleBookmark(event._id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              bookmarked.includes(event._id) 
                ? 'bg-yellow-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-yellow-500 hover:text-white'
            }`}
            title="Bookmark"
          >
            <FaBookmark className="text-sm" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); shareEvent(event); }}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
            title="Share"
          >
            <FaShare className="text-sm" />
          </button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/95 rounded-full text-gray-800 font-semibold text-xs">
            {event.category}
          </span>
        </div>

        {/* Trending Badge */}
        {event.soldPercentage >= 60 && (
          <div className="absolute top-12 left-3">
            <span className="px-3 py-1 bg-red-500 rounded-full text-white font-bold text-xs flex items-center gap-1">
              <FaFire /> Hot
            </span>
          </div>
        )}

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
              <div className="text-white font-bold text-xl">${event.minPrice}</div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm">
              Book <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white border border-gray-200 rounded-2xl overflow-hidden h-64">
      <div className="bg-gray-200 h-full" />
    </div>
  );

  const tabs = [
    { id: 'trending', label: 'Trending', icon: <FaChartLine />, color: 'green' },
    { id: 'popular', label: 'Popular', icon: <FaTrophy />, color: 'yellow' },
    { id: 'upcoming', label: 'Upcoming', icon: <FaFire />, color: 'red' },
  ];

  const getCurrentEvents = () => {
    return suggestions[activeTab] || [];
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <FaLightbulb className="text-2xl text-white" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900">
              Event <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Suggestions</span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Personalized recommendations just for you
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={fetchSuggestions}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center gap-2"
            >
              <FaRandom /> Refresh Suggestions
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors ${showFilters
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600'
                }`}
            >
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-10 flex justify-center">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-1 inline-flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{suggestions.trending.length}</div>
              <div className="text-sm text-gray-600 font-medium">Trending</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{suggestions.popular.length}</div>
              <div className="text-sm text-gray-600 font-medium">Popular</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{suggestions.upcoming.length}</div>
              <div className="text-sm text-gray-600 font-medium">Upcoming</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">{favorites.length}</div>
              <div className="text-sm text-gray-600 font-medium">Favorites</div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="mb-12">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : getCurrentEvents().length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getCurrentEvents().map((event, i) => (
                <SuggestionCard key={event._id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Suggestions Available</h3>
              <p className="text-gray-600 mb-6">Try refreshing or check back later</p>
              <button
                onClick={fetchSuggestions}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Refresh Suggestions
              </button>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Browse all events or create your own amazing experience
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/events"
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              Browse All Events <FaArrowRight />
            </Link>
            {user && (
              <Link
                to="/create-event"
                className="px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center gap-2"
              >
                ✨ Create Event
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

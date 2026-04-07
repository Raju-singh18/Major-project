import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import {
  FaMapMarkerAlt,
  FaCalendar,
  FaClock,
  FaFire,
  FaStar,
  FaSort,
  FaArrowRight,
  FaTicketAlt,
  FaUsers,
  FaFilter,
  FaDollarSign,
  FaHeart,
  FaShare,
  FaSearch,
  FaBookmark,
  FaThLarge,
  FaList,
  FaTimes,
  FaEye
} from 'react-icons/fa';

export default function Events() {
  const { user } = useContext(AuthContext);
  const { toasts, success, error, removeToast } = useToast();

  // State Management
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(1000);
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  // User Interactions
  const [wishlist, setWishlist] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  
  // View Mode & Quick View
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewEvent, setQuickViewEvent] = useState(null);
  
  // Suggested Events
  const [suggestedEvents, setSuggestedEvents] = useState([]);

  // Categories Configuration
  const categories = [
    { name: 'Music', icon: '🎵' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Conference', icon: '💼' },
    { name: 'Workshop', icon: '�' },
    { name: 'Festival', icon: '🎉' },
    { name: 'Theater', icon: '🎭' }
  ];

  // Load wishlist from backend and bookmarks from localStorage
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
    
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarked(JSON.parse(savedBookmarks));
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const { data } = await api.get('/wishlist');
      const wishlistIds = data.map(event => event._id);
      setWishlist(wishlistIds);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  // Fetch Events
  useEffect(() => {
    fetchEvents();
    fetchFeaturedEvents();
    fetchSuggestedEvents();
  }, [selectedCategory]);

  // Extract unique cities from events
  useEffect(() => {
    if (events.length > 0) {
      const cities = [...new Set(events.map(e => e.location?.city).filter(Boolean))];
      setAvailableCities(cities.sort());
    }
  }, [events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;

      const { data } = await api.get('/events', { params });

      const processedEvents = data.map(event => ({
        ...event,
        minPrice: event.minPrice || (event.ticketTypes?.length
          ? Math.min(...event.ticketTypes.map(t => t.price))
          : 0)
      }));

      setEvents(processedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      const { data } = await api.get('/events', { params: { featured: true, limit: 3 } });
      const processedEvents = data.map(event => ({
        ...event,
        minPrice: event.minPrice || (event.ticketTypes?.length
          ? Math.min(...event.ticketTypes.map(t => t.price))
          : 0)
      }));
      setFeaturedEvents(processedEvents);
    } catch (err) {
      console.error('Error fetching featured events:', err);
    }
  };

  const fetchSuggestedEvents = async () => {
    try {
      const { data } = await api.get('/events', { params: { sortBy: 'popular', limit: 4 } });
      const processedEvents = data.map(event => ({
        ...event,
        minPrice: event.minPrice || (event.ticketTypes?.length
          ? Math.min(...event.ticketTypes.map(t => t.price))
          : 0)
      }));
      setSuggestedEvents(processedEvents);
    } catch (err) {
      console.error('Error fetching suggested events:', err);
    }
  };

  // Filter and Sort Logic
  const getFilteredAndSortedEvents = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter(event => event.location?.city === selectedCity);
    }

    // Price filter
    filtered = filtered.filter(event => event.minPrice <= priceRange);

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));

        if (dateFilter === 'today') return diffDays === 0;
        if (dateFilter === 'week') return diffDays >= 0 && diffDays <= 7;
        if (dateFilter === 'month') return diffDays >= 0 && diffDays <= 30;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'price-low':
          return a.minPrice - b.minPrice;
        case 'price-high':
          return b.minPrice - a.minPrice;
        case 'popular':
          return (b.totalSeats - b.availableSeats) - (a.totalSeats - a.availableSeats);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // User Actions
  const toggleWishlist = async (eventId) => {
    if (!user) {
      error('Please login to add events to wishlist');
      return;
    }

    try {
      const { data } = await api.post('/wishlist/toggle', { eventId });

      if (data.isInWishlist) {
        setWishlist([...wishlist, eventId]);
        success('✨ Event added to wishlist!');
      } else {
        setWishlist(wishlist.filter(id => id !== eventId));
        success('🗑️ Event removed from wishlist');
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const toggleBookmark = (eventId) => {
    const newBookmarked = bookmarked.includes(eventId)
      ? bookmarked.filter(id => id !== eventId)
      : [...bookmarked, eventId];
    
    setBookmarked(newBookmarked);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarked));
    
    if (newBookmarked.includes(eventId)) {
      success('📌 Event bookmarked!');
    } else {
      success('📌 Bookmark removed');
    }
  };

  const shareEvent = async (event) => {
    const url = `${window.location.origin}/events/${event._id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: url
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      success('Link copied to clipboard!');
    }
  };

  const openQuickView = (event) => {
    setQuickViewEvent(event);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setQuickViewEvent(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedCity('');
    setPriceRange(1000);
    setDateFilter('all');
  };

  const filteredEvents = getFilteredAndSortedEvents();

  const EventCard = ({ event }) => (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors group">
      <Link to={`/events/${event._id}`}>
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
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(event._id);
              }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                wishlist.includes(event._id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
              title="Add to wishlist"
            >
              <FaHeart className="text-sm" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleBookmark(event._id);
              }}
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
              onClick={(e) => {
                e.preventDefault();
                shareEvent(event);
              }}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
              title="Share"
            >
              <FaShare className="text-sm" />
            </button>
          </div>

          {/* Quick View Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              openQuickView(event);
            }}
            className="absolute top-3 left-3 px-3 py-1 bg-white/95 rounded-full text-gray-800 font-semibold text-xs flex items-center gap-1 hover:bg-purple-600 hover:text-white transition-colors"
          >
            <FaEye /> Quick View
          </button>

          {/* Category Badge */}
          <div className="absolute top-12 left-3">
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
                <span>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <FaMapMarkerAlt className="text-purple-300" />
                <span className="line-clamp-1">{event.location?.city}, {event.location?.country}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/30">
              <div>
                <span className="text-white/80 text-xs">From</span>
                <div className="text-white font-bold text-xl">₹{event.minPrice}</div>
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

  const SkeletonCard = () => (
    <div className="animate-pulse bg-white border border-gray-200 rounded-2xl overflow-hidden h-64">
      <div className="bg-gray-200 h-full" />
    </div>
  );

  const EventListItem = ({ event }) => (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors">
      <Link to={`/events/${event._id}`} className="flex flex-col md:flex-row">
        <div className="relative md:w-80 h-48 md:h-auto overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/95 rounded-full text-gray-800 font-semibold text-xs">
              {event.category}
            </span>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
              <p className="text-gray-600 line-clamp-2">{event.description}</p>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(event._id);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  wishlist.includes(event._id)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <FaHeart />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleBookmark(event._id);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  bookmarked.includes(event._id)
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-500 hover:text-white'
                }`}
              >
                <FaBookmark />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  openQuickView(event);
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-purple-600 hover:text-white transition-colors"
              >
                <FaEye />
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCalendar className="text-purple-600" />
              <span>
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt className="text-red-600" />
              <span>{event.location?.city}, {event.location?.country}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <span className="text-gray-600 text-sm">Starting from</span>
              <div className="text-3xl font-bold text-purple-600">₹{event.minPrice}</div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
              Book Now <FaArrowRight />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );

  const QuickViewModal = () => {
    if (!showQuickView || !quickViewEvent) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeQuickView}>
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="relative">
            <img
              src={quickViewEvent.image}
              alt={quickViewEvent.title}
              className="w-full h-80 object-cover"
            />
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white rounded-full text-gray-800 font-bold">
                {quickViewEvent.category}
              </span>
            </div>
          </div>
          
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{quickViewEvent.title}</h2>
            <p className="text-gray-600 mb-6">{quickViewEvent.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FaCalendar className="text-purple-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-semibold">
                    {new Date(quickViewEvent.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FaMapMarkerAlt className="text-red-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold">
                    {quickViewEvent.location?.venue}, {quickViewEvent.location?.city}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FaDollarSign className="text-green-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="font-semibold text-2xl text-green-600">₹{quickViewEvent.minPrice}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Available Seats</div>
                  <div className="font-semibold">{quickViewEvent.availableSeats} / {quickViewEvent.totalSeats}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Link
                to={`/events/${quickViewEvent._id}`}
                className="flex-1 px-6 py-4 bg-purple-600 text-white rounded-xl font-bold text-center hover:bg-purple-700 transition-colors"
              >
                View Full Details & Book
              </Link>
              <button
                onClick={() => toggleWishlist(quickViewEvent._id)}
                className={`px-6 py-4 rounded-xl font-bold transition-colors ${
                  wishlist.includes(quickViewEvent._id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white'
                }`}
              >
                <FaHeart className="text-xl" />
              </button>
              <button
                onClick={() => shareEvent(quickViewEvent)}
                className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-blue-500 hover:text-white transition-colors"
              >
                <FaShare className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">

        <div className="container mx-auto px-4">

          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Discover Amazing <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Events</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              Find and book the perfect experience for you
            </p>

            {user && (
              <Link
                to="/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-colors"
              >
                <span>✨</span>
                Create Your Event
                <FaArrowRight className="text-sm" />
              </Link>
            )}
          </div>

          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <FaFire className="text-3xl text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredEvents.map((event) => (
                  <Link
                    key={event._id}
                    to={`/events/${event._id}`}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200 hover:border-purple-300 transition-colors"
                  >
                    <div className="relative h-80">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                      <div className="absolute top-4 right-4">
                        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold">
                          <FaStar /> Featured
                        </span>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                        <div className="flex items-center gap-2 text-white/90 text-sm mb-3">
                          <FaCalendar />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-orange-400">
                            ${event.minPrice}
                          </span>
                          <span className="px-4 py-2 bg-white/20 rounded-lg text-white font-semibold">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">

              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors ${
                    showFilters
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-purple-500'
                  }`}
                >
                  <FaFilter /> Filters
                </button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid md:grid-cols-4 gap-6 mb-6">

                    {/* City Filter */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                      >
                        <option value="">All Cities</option>
                        {availableCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaDollarSign className="text-green-500" />
                        Max Price: ${priceRange}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="50"
                        value={priceRange}
                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>

                    {/* Date Filter */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaCalendar className="text-blue-500" />
                        Date Range
                      </label>
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                      >
                        <option value="all">All Dates</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FaSort className="text-purple-500" />
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                      >
                        <option value="date">Date (Earliest)</option>
                        <option value="price-low">Price (Low to High)</option>
                        <option value="price-high">Price (High to Low)</option>
                        <option value="popular">Most Popular</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCity && (
                      <span className="px-3 py-1 bg-red-100 border border-red-200 text-red-700 rounded-full text-sm flex items-center gap-2">
                        📍 {selectedCity}
                        <button onClick={() => setSelectedCity('')} className="hover:text-red-900">✕</button>
                      </span>
                    )}
                    {priceRange < 1000 && (
                      <span className="px-3 py-1 bg-green-100 border border-green-200 text-green-700 rounded-full text-sm flex items-center gap-2">
                        💰 Under ${priceRange}
                        <button onClick={() => setPriceRange(1000)} className="hover:text-green-900">✕</button>
                      </span>
                    )}
                    {dateFilter !== 'all' && (
                      <span className="px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 rounded-full text-sm flex items-center gap-2">
                        📅 {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'This Month'}
                        <button onClick={() => setDateFilter('all')} className="hover:text-blue-900">✕</button>
                      </span>
                    )}
                  </div>

                  {/* Clear Filters */}
                  {(searchTerm || selectedCategory || selectedCity || priceRange < 1000 || dateFilter !== 'all') && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              )}

              {/* Category Pills */}
              <div className="flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                      selectedCategory === cat.name
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}

                <Link
                  to="/suggestions"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-colors text-sm"
                >
                  Suggestions
                </Link>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-700 font-medium">
                Found <span className="text-purple-600 font-bold">{filteredEvents.length}</span> events
                {events.length > 0 && filteredEvents.length === 0 && (
                  <span className="ml-2 text-yellow-600">(filtered from {events.length} total)</span>
                )}
              </p>
              
              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-white border-2 border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Grid View"
                >
                  <FaThLarge /> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="List View"
                >
                  <FaList /> List
                </button>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12' 
              : 'space-y-4 mb-12'
            }>
              {filteredEvents.map((event) => (
                viewMode === 'grid' ? (
                  <EventCard key={event._id} event={event} />
                ) : (
                  <EventListItem key={event._id} event={event} />
                )
              ))}
            </div>
          )}

          {/* Stats Section */}
          {!loading && filteredEvents.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {filteredEvents.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Events</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {filteredEvents.filter(e => e.availableSeats > 0).length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Available</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Categories</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {wishlist.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Favorites</div>
              </div>
            </div>
          )}

          {/* You Might Also Like Section */}
          {!loading && suggestedEvents.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <FaFire className="text-3xl text-orange-500" />
                <h2 className="text-3xl font-bold text-gray-900">You Might Also Like</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal />
    </>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import {
  FaMapMarkerAlt, FaCalendar, FaFire, FaHeart,
  FaArrowRight, FaTrophy, FaLightbulb, FaChartLine,
  FaShare, FaBookmark, FaRandom, FaStar, FaUsers,
  FaHistory, FaQuoteLeft, FaCheckCircle
} from 'react-icons/fa';

export default function Suggestions() {
  const { user } = useContext(AuthContext);
  const { toasts, success, error, removeToast } = useToast();
  const [suggestions, setSuggestions] = useState({
    trending: [], upcoming: [], popular: []
  });
  const [pastEvents, setPastEvents] = useState([]);
  const [pastLoading, setPastLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [bookmarked, setBookmarked] = useState([]);
  const [activeTab, setActiveTab] = useState('trending');
  const [pastCategory, setPastCategory] = useState('All');

  const CATEGORIES = ['All', 'Music', 'Sports', 'Conference', 'Workshop', 'Festival', 'Theater', 'Other'];

  useEffect(() => {
    const fav = localStorage.getItem('favorites');
    if (fav) setFavorites(JSON.parse(fav));
    const bm = localStorage.getItem('bookmarks');
    if (bm) setBookmarked(JSON.parse(bm));
  }, []);

  useEffect(() => { fetchSuggestions(); }, []);
  useEffect(() => { fetchPastEvents(); }, [pastCategory]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const [trendingRes, upcomingRes, popularRes] = await Promise.all([
        api.get('/events', { params: { limit: 8, sortBy: 'trending' } }),
        api.get('/events', { params: { limit: 8, sortBy: 'date' } }),
        api.get('/events', { params: { limit: 8, sortBy: 'popular' } })
      ]);
      const process = (events) => events.map(e => ({
        ...e,
        minPrice: e.minPrice || (Array.isArray(e.ticketTypes) && e.ticketTypes.length
          ? Math.min(...e.ticketTypes.map(t => t.price)) : 0)
      }));
      setSuggestions({
        trending: process(trendingRes.data),
        upcoming: process(upcomingRes.data),
        popular: process(popularRes.data)
      });
    } catch (err) {
      console.error('Error fetching suggestions', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPastEvents = async () => {
    setPastLoading(true);
    try {
      const params = { limit: 8 };
      if (pastCategory !== 'All') params.category = pastCategory;
      const { data } = await api.get('/events/past', { params });
      setPastEvents(data);
    } catch (err) {
      console.error('Error fetching past events', err);
    } finally {
      setPastLoading(false);
    }
  };

  const toggleFavorite = async (id) => {
    if (!user) { error('Please login to save events'); return; }
    try {
      const { data } = await api.post('/wishlist/toggle', { eventId: id });
      if (data.isInWishlist) {
        setFavorites(prev => [...prev, id]);
        success('✨ Added to wishlist!');
      } else {
        setFavorites(prev => prev.filter(x => x !== id));
        success('Removed from wishlist');
      }
    } catch (err) {
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
      try { await navigator.share({ title: event.title, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      success('Link copied!');
    }
  };

  // ── Upcoming event card ────────────────────────────────────────────────────
  const SuggestionCard = ({ event }) => (
    <Link to={`/events/${event._id}`} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors">
      <div className="relative h-64 overflow-hidden">
        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2">
          <button onClick={(e) => { e.preventDefault(); toggleFavorite(event._id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${favorites.includes(event._id) ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'}`}>
            <FaHeart className="text-sm" />
          </button>
          <button onClick={(e) => { e.preventDefault(); toggleBookmark(event._id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${bookmarked.includes(event._id) ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-yellow-500 hover:text-white'}`}>
            <FaBookmark className="text-sm" />
          </button>
          <button onClick={(e) => { e.preventDefault(); shareEvent(event); }}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-blue-500 hover:text-white transition-colors">
            <FaShare className="text-sm" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/95 rounded-full text-gray-800 font-semibold text-xs">{event.category}</span>
        </div>
        {event.soldPercentage >= 60 && (
          <div className="absolute top-12 left-3">
            <span className="px-3 py-1 bg-red-500 rounded-full text-white font-bold text-xs flex items-center gap-1"><FaFire /> Hot</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{event.title}</h3>
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
              <div className="text-white font-bold text-xl">&#8377;{event.minPrice}</div>
            </div>
            <span className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm">
              Book <FaArrowRight className="text-xs" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  // ── Past event card ────────────────────────────────────────────────────────
  const PastEventCard = ({ event }) => {
    const stars = event.avgRating || 0;
    const fullStars = Math.floor(stars);

    return (
      <Link to={`/events/${event._id}`} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 hover:shadow-lg transition-all flex flex-col">
        {/* Image */}
        <div className="relative h-44 overflow-hidden flex-shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Past badge */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-1 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <FaHistory className="text-gray-300" /> Ended
            </span>
            <span className="px-2.5 py-1 bg-white/90 text-gray-800 text-xs font-semibold rounded-full">{event.category}</span>
          </div>

          {/* Rating overlay */}
          {event.totalReviews > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-white font-bold text-sm">{stars.toFixed(1)}</span>
              <span className="text-white/70 text-xs">({event.totalReviews})</span>
            </div>
          )}

          {/* Attendee count */}
          {event.attendeeCount > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <FaUsers className="text-blue-300 text-xs" />
              <span className="text-white text-xs font-semibold">{event.attendeeCount.toLocaleString()} attended</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-purple-700 transition-colors">{event.title}</h3>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <FaCalendar className="text-purple-400" />
              {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-orange-400" />
              {event.location?.city}
            </span>
          </div>

          {/* Star row */}
          {event.totalReviews > 0 ? (
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`text-xs ${i < fullStars ? 'text-yellow-400' : 'text-gray-200'}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1">{stars.toFixed(1)} · {event.totalReviews} {event.totalReviews === 1 ? 'review' : 'reviews'}</span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-3 italic">No reviews yet</p>
          )}

          {/* Top review snippet */}
          {event.topReview && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-3 flex-1">
              <div className="flex items-start gap-2">
                <FaQuoteLeft className="text-purple-300 text-xs mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 italic">
                    {event.topReview.comment}
                  </p>
                  <p className="text-xs text-gray-400 mt-1.5 font-medium">— {event.topReview.reviewerName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-1.5">
              {event.totalReviews > 0 && (
                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                  <FaCheckCircle /> Verified reviews
                </span>
              )}
            </div>
            <span className="text-xs text-purple-600 font-semibold group-hover:underline flex items-center gap-1">
              See details <FaArrowRight className="text-xs" />
            </span>
          </div>
        </div>
      </Link>
    );
  };

  const SkeletonCard = ({ tall = false }) => (
    <div className={`animate-pulse bg-white border border-gray-200 rounded-2xl overflow-hidden ${tall ? 'h-80' : 'h-64'}`}>
      <div className="bg-gray-200 h-full" />
    </div>
  );

  const tabs = [
    { id: 'trending', label: 'Trending', icon: <FaChartLine /> },
    { id: 'popular', label: 'Popular', icon: <FaTrophy /> },
    { id: 'upcoming', label: 'Upcoming', icon: <FaFire /> },
  ];

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
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Event <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Suggestions</span>
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">Personalized recommendations just for you</p>
            <button
              onClick={fetchSuggestions}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition-colors inline-flex items-center gap-2"
            >
              <FaRandom /> Refresh Suggestions
            </button>
          </div>

          {/* Stats Bar */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Trending', value: suggestions.trending.length, color: 'text-purple-600' },
                { label: 'Popular', value: suggestions.popular.length, color: 'text-yellow-600' },
                { label: 'Upcoming', value: suggestions.upcoming.length, color: 'text-green-600' },
                { label: 'Favorites', value: favorites.length, color: 'text-red-600' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                  <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="mb-8 flex justify-center">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-1 inline-flex gap-1">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Events Grid */}
          <div className="mb-16">
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (suggestions[activeTab] || []).length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(suggestions[activeTab] || []).map((event) => (
                  <SuggestionCard key={event._id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Suggestions Available</h3>
                <p className="text-gray-600 mb-6">Try refreshing or check back later</p>
                <button onClick={fetchSuggestions} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                  Refresh
                </button>
              </div>
            )}
          </div>

          {/* ── Past Events Section ──────────────────────────────────────── */}
          <div className="mb-16">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                    <FaHistory className="text-white text-sm" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Past Events</h2>
                </div>
                <p className="text-gray-500 text-sm ml-13 pl-1">
                  Real experiences from verified attendees — see what you might have missed and discover similar upcoming events.
                </p>
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setPastCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      pastCategory === cat
                        ? 'bg-gray-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Social proof banner */}
            {!pastLoading && pastEvents.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl px-6 py-4 mb-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-purple-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {pastEvents.reduce((s, e) => s + (e.attendeeCount || 0), 0).toLocaleString()} total attendees
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    {pastEvents.filter(e => e.totalReviews > 0).length > 0
                      ? (pastEvents.filter(e => e.avgRating > 0).reduce((s, e) => s + e.avgRating, 0) /
                          pastEvents.filter(e => e.avgRating > 0).length).toFixed(1)
                      : '—'} avg rating across {pastEvents.reduce((s, e) => s + e.totalReviews, 0)} reviews
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-sm font-semibold text-gray-700">All reviews from verified ticket holders</span>
                </div>
              </div>
            )}

            {/* Past events grid */}
            {pastLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} tall />)}
              </div>
            ) : pastEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pastEvents.map(event => <PastEventCard key={event._id} event={event} />)}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-600 font-medium">No past events found{pastCategory !== 'All' ? ` in ${pastCategory}` : ''}</p>
                {pastCategory !== 'All' && (
                  <button onClick={() => setPastCategory('All')} className="mt-3 text-sm text-purple-600 font-semibold hover:underline">
                    Clear filter
                  </button>
                )}
              </div>
            )}

            {/* "Why past events matter" nudge for new users */}
            {!pastLoading && pastEvents.length > 0 && (
              <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 grid sm:grid-cols-3 gap-6 text-center">
                {[
                  { icon: '🎯', title: 'Make better decisions', desc: 'Read honest reviews from real attendees before booking your next event.' },
                  { icon: '🔁', title: 'Find recurring events', desc: 'Many events happen annually. Past editions show you what to expect.' },
                  { icon: '📈', title: 'Discover rising organizers', desc: 'See which organizers consistently deliver great experiences.' },
                ].map(item => (
                  <div key={item.title}>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Can't find what you're looking for?</h3>
            <p className="text-gray-600 mb-8 text-lg">Browse all events or create your own experience</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/events" className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors flex items-center gap-2">
                Browse All Events <FaArrowRight />
              </Link>
              {user && (
                <Link to="/create-event" className="px-8 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-colors flex items-center gap-2">
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

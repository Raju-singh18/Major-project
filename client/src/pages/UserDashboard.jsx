import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaCalendar, FaStar, FaBell, FaArrowRight, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { API_URL } from '../config/api';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    upcomingBookings: 0,
    pastBookings: 0,
    totalSpent: 0,
    unreadNotifications: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, notificationsRes] = await Promise.all([
        axios.get(`${API_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${user.token}` }
        }),
        axios.get(`${API_URL}/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
      ]);

      const bookings = bookingsRes.data;
      const now = new Date();

      const upcoming = bookings.filter(b => 
        new Date(b.event.date) > now && b.status === 'confirmed'
      );
      const past = bookings.filter(b => 
        new Date(b.event.date) <= now && b.status === 'confirmed'
      );
      const totalSpent = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        upcomingBookings: upcoming.length,
        pastBookings: past.length,
        totalSpent,
        unreadNotifications: notificationsRes.data.count
      });

      setUpcomingEvents(upcoming.slice(0, 5));
      setRecentBookings(bookings.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
        <p className="text-gray-700 font-medium text-lg">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{user.name}</span>!
          </h1>
          <p className="text-gray-600 text-lg">Here's your event activity overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 font-medium text-sm">Upcoming Events</p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stats.upcomingBookings}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaCalendar className="text-blue-600 text-xl md:text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 font-medium text-sm">Past Events</p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stats.pastBookings}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaTicketAlt className="text-purple-600 text-xl md:text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 font-medium text-sm">Total Spent</p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FaStar className="text-green-600 text-xl md:text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 font-medium text-sm">Notifications</p>
                <p className="text-3xl md:text-4xl font-bold text-gray-900">{stats.unreadNotifications}</p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <FaBell className="text-orange-600 text-xl md:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Upcoming Events */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📅 Upcoming Events</h2>
              <Link to="/my-bookings" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors text-sm flex items-center gap-1">
                View All <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-600 mb-4 text-lg">No upcoming events</p>
                <Link to="/events" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((booking) => (
                  <Link
                    key={booking._id}
                    to={`/events/${booking.event._id}`}
                    className="block border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={booking.event.image}
                        alt={booking.event.title}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{booking.event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <FaCalendar className="text-purple-500 flex-shrink-0" />
                          <span>{new Date(booking.event.date).toLocaleDateString()}</span>
                          <FaClock className="text-purple-500 flex-shrink-0 ml-2" />
                          <span>{booking.event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                          <span className="line-clamp-1">{booking.event.location.venue}, {booking.event.location.city}</span>
                        </div>
                        <p className="text-sm font-semibold text-purple-600 mt-2">
                          🎫 {booking.tickets.reduce((sum, t) => sum + t.quantity, 0)} ticket(s)
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">🎫 Recent Bookings</h2>
              <Link to="/my-bookings" className="text-purple-600 hover:text-purple-700 font-semibold transition-colors text-sm flex items-center gap-1">
                View All <FaArrowRight className="text-xs" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎫</div>
                <p className="text-gray-600 mb-4 text-lg">No bookings yet</p>
                <Link to="/events" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                  Book Your First Event
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 line-clamp-1">{booking.event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Ref: {booking.bookingReference}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-3">
                      <span className="text-gray-600">
                        📅 {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-purple-600 text-lg">
                        ${booking.totalAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-10 text-white">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">🎉 Discover More Events</h2>
            <p className="mb-6 text-white/90 text-lg">Find exciting events happening near you</p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Browse All Events <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

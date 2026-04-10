import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../config/api';
import {
  FaCalendarAlt, FaTicketAlt, FaMoneyBillWave, FaStar,
  FaArrowRight, FaPlus, FaChartBar, FaUsers, FaCheckCircle
} from 'react-icons/fa';

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );
};

const OrganizerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/organizer/stats'),
      api.get('/events/my-events'),
    ]).then(([statsRes, eventsRes]) => {
      setStats(statsRes.data);
      setEvents(eventsRes.data.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-28 bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <FaCalendarAlt className="text-white text-2xl" />
        </div>
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 sm:pt-28 pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, <span className="text-purple-600">{user.name}</span>
            </h1>
            <p className="text-gray-500 mt-1">Here's your organizer overview</p>
          </div>
          <Link
            to="/create-event"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            <FaPlus className="text-sm" /> Create Event
          </Link>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FaCalendarAlt} label="Total Events" value={stats.totalEvents} color="purple" />
            <StatCard icon={FaCheckCircle} label="Published" value={stats.publishedEvents} color="green" />
            <StatCard icon={FaTicketAlt} label="Tickets Sold" value={stats.totalTicketsSold} color="blue" />
            <StatCard icon={FaMoneyBillWave} label="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="orange" />
          </div>
        )}

        {/* Secondary Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FaCalendarAlt} label="Upcoming Events" value={stats.upcomingEvents} color="blue" />
            <StatCard icon={FaChartBar} label="Past Events" value={stats.pastEvents} color="purple" />
            <StatCard icon={FaUsers} label="Total Bookings" value={stats.totalBookings} color="green" />
            <StatCard icon={FaStar} label="Avg Rating" value={`${stats.avgRating} ★`} color="yellow" />
          </div>
        )}

        {/* Recent Events */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            <Link to="/my-events" className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-gray-500 mb-4">No events yet</p>
              <Link to="/create-event" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                <FaPlus /> Create Your First Event
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map(event => (
                <div key={event._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-purple-200 transition-colors">
                  <img src={event.image} alt={event.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{event.title}</h3>
                    <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()} · {event.location?.city}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'published' ? 'bg-green-100 text-green-700' :
                      event.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {event.status}
                    </span>
                    <Link to={`/event-dashboard/${event._id}`} className="text-sm text-purple-600 hover:underline font-medium">
                      Analytics
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Ready to create your next event?</h2>
          <p className="text-purple-200 mb-5">Reach thousands of attendees on EventMe</p>
          <Link to="/create-event" className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors">
            <FaPlus /> New Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;

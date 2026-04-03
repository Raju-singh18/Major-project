import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendar, FaMapMarkerAlt, FaEdit, FaTrash, FaChartBar } from 'react-icons/fa';
import { API_URL } from '../config/api';

const MyEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events/my-events`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/events/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchMyEvents();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-28 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-700 font-medium text-lg">Loading your events...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Events</h1>
        <Link to="/create-event" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all font-bold">
          ✨ Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <div className="text-6xl mb-4">📅</div>
          <p className="mb-4 text-gray-700 text-xl">You haven't created any events yet</p>
          <Link to="/create-event" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all">
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 hover:scale-105 transition-all">
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  event.status === 'published' ? 'bg-green-100 text-green-700 border border-green-200' :
                  event.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                  'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {event.status}
                </span>
                <h3 className="text-xl font-bold mt-3 mb-3 text-gray-900">{event.title}</h3>
                <div className="text-gray-600 text-sm space-y-2 mb-4">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2 text-purple-600" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-orange-600" />
                    {event.location.city}
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-4 font-semibold">
                  {event.availableSeats} / {event.totalSeats} seats available
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/event-dashboard/${event._id}`}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl text-center hover:from-purple-700 hover:to-indigo-700 transition-all font-bold"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={`/edit-event/${event._id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default MyEvents;

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import { FaCalendar, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { API_URL } from '../config/api';

const MyEvents = () => {
  const { user } = useContext(AuthContext);
  const { toasts, success, error, removeToast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchMyEvents(); }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/events/my-events`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEvents(data);
    } catch (err) {
      error('Failed to load your events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/events/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      success('🗑️ Event deleted successfully');
      setConfirmDeleteId(null);
      fetchMyEvents();
    } catch (err) {
      error(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20 sm:pt-28 bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-700 font-medium text-lg">Loading your events...</p>
      </div>
    </div>
  );

  const eventToDelete = events.find(e => e._id === confirmDeleteId);

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12 bg-gray-50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">My Events</h1>
            <Link to="/create-event"
              className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-bold">
              ✨ Create New Event
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
              <div className="text-6xl mb-4">📅</div>
              <p className="mb-4 text-gray-700 text-xl">You haven't created any events yet</p>
              <Link to="/create-event"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors">
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors">
                  <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                      event.status === 'published' ? 'bg-green-100 text-green-700 border border-green-200' :
                      event.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>{event.status}</span>
                    <h3 className="text-xl font-bold mt-3 mb-3 text-gray-900">{event.title}</h3>
                    <div className="text-gray-600 text-sm space-y-2 mb-4">
                      <div className="flex items-center gap-2"><FaCalendar className="text-purple-600" />{new Date(event.date).toLocaleDateString()}</div>
                      <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-orange-600" />{event.location.city}</div>
                    </div>
                    <div className="text-sm text-gray-700 mb-4 font-semibold">
                      {event.availableSeats} / {event.totalSeats} seats available
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/event-dashboard/${event._id}`}
                        className="flex-1 bg-purple-600 text-white py-2 rounded-xl text-center hover:bg-purple-700 transition-colors font-bold text-sm">
                        Dashboard
                      </Link>
                      <Link to={`/edit-event/${event._id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors">
                        <FaEdit />
                      </Link>
                      <button onClick={() => setConfirmDeleteId(event._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors">
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

      {/* Delete Confirm Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-full max-w-md">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTrash className="text-red-600 text-xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Event?</h3>
            <p className="text-gray-500 text-center text-sm mb-1">
              You're about to delete <span className="font-semibold text-gray-800">"{eventToDelete?.title}"</span>.
            </p>
            <p className="text-red-500 text-center text-xs mb-6">This will also remove all associated bookings. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50">
                {deleting
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Deleting...</>
                  : <><FaTrash /> Delete Event</>
                }
              </button>
              <button onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyEvents;


import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const EditEvent = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toasts, success, error, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Music',
    date: '', time: '', venue: '', address: '',
    city: '', country: '', image: '', status: 'published'
  });
  const [ticketTypes, setTicketTypes] = useState([]);

  useEffect(() => { fetchEvent(); }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setFormData({
        title: data.title, description: data.description, category: data.category,
        date: data.date.split('T')[0], time: data.time,
        venue: data.location.venue, address: data.location.address,
        city: data.location.city, country: data.location.country,
        image: data.image, status: data.status
      });
      setTicketTypes(data.ticketTypes);
    } catch (err) {
      error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/events/${id}`, {
        ...formData,
        location: { venue: formData.venue, address: formData.address, city: formData.city, country: formData.country },
        ticketTypes
      });
      success('✅ Event updated successfully!');
      setTimeout(() => navigate('/my-events'), 1200);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  const updateTicketType = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
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
        <p className="text-gray-700 font-medium text-lg">Loading event...</p>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Event</h1>

            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900">
                    <option value="Music">🎵 Music</option>
                    <option value="Sports">⚽ Sports</option>
                    <option value="Conference">💼 Conference</option>
                    <option value="Workshop">🎓 Workshop</option>
                    <option value="Festival">🎉 Festival</option>
                    <option value="Theater">🎭 Theater</option>
                    <option value="Other">📌 Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900"
                  rows="4" required />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">📅 Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">🕐 Time</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">🏛️ Venue</label>
                  <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">📍 Address</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">🌆 City</label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">🌍 Country</label>
                  <input type="text" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">🖼️ Image URL</label>
                  <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">📊 Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">🎟️ Ticket Types</h3>
                {ticketTypes.map((ticket, index) => (
                  <div key={index} className="grid md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Ticket Type</label>
                      <input type="text" value={ticket.name} onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Price</label>
                      <input type="number" value={ticket.price} onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                      <input type="number" value={ticket.quantity} onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Sold</label>
                      <div className="px-4 py-2 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold flex items-center">{ticket.sold}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting
                    ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                    : '✨ Update Event'
                  }
                </button>
                <button type="button" onClick={() => navigate('/my-events')}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 font-bold text-lg transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEvent;

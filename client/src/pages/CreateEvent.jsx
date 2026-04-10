import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const CreateEvent = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toasts, success, error, removeToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Music',
    date: '', time: '', venue: '', address: '',
    city: '', country: '', image: '', totalSeats: 0
  });
  const [ticketTypes, setTicketTypes] = useState([{ name: 'General', price: 0, quantity: 0 }]);

  if (user && user.role === 'user') {
    return (
      <div className="min-h-screen pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12 bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-3xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚫</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Access Restricted</h2>
          <p className="text-xl text-gray-700 mb-6">Only organizers and admins can create events.</p>
          <p className="text-gray-600 mb-8">Your account is registered as a <strong>User</strong>. Users can browse and book events, but cannot create them.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/events')} className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">Browse Events</button>
            <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-purple-500 hover:text-purple-600">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) { error('Please upload an event image'); return; }
    setSubmitting(true);
    try {
      await api.post('/events', {
        ...formData,
        location: { venue: formData.venue, address: formData.address, city: formData.city, country: formData.country },
        ticketTypes
      });
      success('🎉 Event created successfully!');
      setTimeout(() => navigate('/my-events'), 1200);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  const addTicketType = () => setTicketTypes([...ticketTypes, { name: '', price: 0, quantity: 0 }]);
  const removeTicketType = (i) => setTicketTypes(ticketTypes.filter((_, idx) => idx !== i));
  const updateTicketType = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Create New Event</h1>

            {user?.suspended && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3">
                <span className="text-2xl">🚫</span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Account Suspended</h3>
                  <p className="text-sm">Your account has been suspended. You cannot create events at this time.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Event Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900 disabled:opacity-50"
                    required disabled={user?.suspended} />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900 disabled:opacity-50"
                    disabled={user?.suspended}>
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

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
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

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
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

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
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

              <ImageUpload onImageUpload={(url) => setFormData({...formData, image: url})} currentImage={formData.image} label="Event Image" />

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">🎫 Total Seats</label>
                <input type="number" value={formData.totalSeats} onChange={(e) => setFormData({...formData, totalSeats: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">🎟️ Ticket Types</h3>
                {ticketTypes.map((ticket, index) => (
                  <div key={index} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 relative">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Ticket Type</label>
                      <input type="text" placeholder="Ticket Name" value={ticket.name}
                        onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Price</label>
                      <input type="number" placeholder="Price" value={ticket.price}
                        onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-gray-700 font-semibold mb-2">Quantity</label>
                        <input type="number" placeholder="Quantity" value={ticket.quantity}
                          onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 text-gray-900" required />
                      </div>
                      {ticketTypes.length > 1 && (
                        <button type="button" onClick={() => removeTicketType(index)}
                          className="mb-0.5 w-10 h-10 flex items-center justify-center bg-red-50 border-2 border-red-200 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors">
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addTicketType}
                  className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 transition-colors">
                  <span className="text-xl">+</span> Add Ticket Type
                </button>
              </div>

              <button type="submit" disabled={user?.suspended || submitting}
                className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submitting
                  ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating...</>
                  : user?.suspended ? '🚫 Account Suspended' : '✨ Create Event'
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;


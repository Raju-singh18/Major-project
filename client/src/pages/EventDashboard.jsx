import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaDollarSign, FaUsers, FaStar, FaEdit, FaBullhorn } from 'react-icons/fa';
import { API_URL } from '../config/api';
  
const EventDashboard = () => {
  const { id } = useParams();  
  const { user } = useContext(AuthContext);  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcement, setAnnouncement] = useState({ title: '', message: '' });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchAnnouncements();
  }, [id]);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/organizer/event-dashboard/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/announcements/event/${id}`);
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_URL}/announcements`,
        { eventId: id, ...announcement },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAnnouncement({ title: '', message: '' });
      setShowAnnouncement(false);
      fetchAnnouncements();
      alert('Announcement sent successfully!');
    } catch (error) {
      alert('Failed to send announcement');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center pt-28 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-white font-medium text-lg">Event not found</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1f] via-[#1a1a3e] to-[#0f0f23]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A43FF]/20 via-transparent to-[#FF8F00]/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-white">{data.event.title}</h1>
          <p className="text-gray-300 mt-2">📊 Event Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/edit-event/${id}`}
            className="flex items-center gap-2 bg-gradient-to-r from-[#5A43FF] to-purple-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all font-bold"
          >
            <FaEdit /> Edit Event
          </Link>
          <button
            onClick={() => setShowAnnouncement(!showAnnouncement)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all font-bold"
          >
            <FaBullhorn /> Send Announcement
          </button>
        </div>
      </div>

      {showAnnouncement && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Send Announcement to Attendees</h2>
          <form onSubmit={handleSendAnnouncement}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={announcement.title}
                onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Message</label>
              <textarea
                value={announcement.message}
                onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Send to All Attendees
              </button>
              <button
                type="button"
                onClick={() => setShowAnnouncement(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Bookings</p>
              <p className="text-3xl font-bold">{data.stats.totalBookings}</p>
              <p className="text-sm text-green-600">{data.stats.confirmedBookings} confirmed</p>
            </div>
            <FaTicketAlt className="text-4xl text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">${data.stats.totalRevenue}</p>
            </div>
            <FaDollarSign className="text-4xl text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Tickets Sold</p>
              <p className="text-3xl font-bold">{data.stats.ticketsSold}</p>
              <p className="text-sm text-gray-600">{data.stats.availableSeats} available</p>
            </div>
            <FaUsers className="text-4xl text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Avg Rating</p>
              <p className="text-3xl font-bold">{data.stats.avgRating}</p>
              <p className="text-sm text-gray-600">{data.stats.totalReviews} reviews</p>
            </div>
            <FaStar className="text-4xl text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Ticket Type Statistics</h2>
          <div className="space-y-4">
            {data.ticketTypeStats.map((ticket, index) => (
              <div key={index} className="border-b pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{ticket.name}</span>
                  <span className="text-indigo-600 font-bold">${ticket.price}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Sold: {ticket.sold} / {ticket.total}</span>
                  <span>Revenue: ${ticket.revenue}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(ticket.sold / ticket.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Announcements</h2>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-gray-600">No announcements sent yet</p>
            ) : (
              announcements.slice(0, 5).map((ann) => (
                <div key={ann._id} className="border-b pb-3">
                  <div className="font-semibold">{ann.title}</div>
                  <p className="text-sm text-gray-600 mt-1">{ann.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Sent to {ann.sentTo.length} attendees • {new Date(ann.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Booking Ref</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Tickets</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-sm">{booking.bookingReference}</td>
                  <td className="py-3 px-4">
                    <div>{booking.user.name}</div>
                    <div className="text-sm text-gray-600">{booking.user.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    {booking.tickets.map((t, i) => (
                      <div key={i} className="text-sm">
                        {t.quantity}x {t.ticketType}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 font-semibold">${booking.totalAmount}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default EventDashboard;

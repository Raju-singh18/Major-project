import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ToastContainer";
import { FaTicketAlt, FaDollarSign, FaUsers, FaStar, FaEdit, FaBullhorn } from "react-icons/fa";
import { API_URL } from "../config/api";

const EventDashboard = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { toasts, success, error, removeToast } = useToast();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [sending, setSending] = useState(false);
  const [announcement, setAnnouncement] = useState({ title: "", message: "" });
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchAnnouncements();
  }, [id]);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(`${API_URL}/organizer/event-dashboard/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setData(res.data);
    } catch (err) {
      error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_URL}/announcements/event/${id}`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(
        `${API_URL}/announcements`,
        { eventId: id, ...announcement },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAnnouncement({ title: "", message: "" });
      setShowAnnouncement(false);
      fetchAnnouncements();
      success("📢 Announcement sent to all attendees!");
    } catch (err) {
      error(err.response?.data?.message || "Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-700">Loading...</div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">Event not found</div>
  );

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12 bg-gray-50">
        <div className="container mx-auto px-4">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{data.event.title}</h1>
              <p className="text-gray-500">Event Dashboard</p>
            </div>
            <div className="flex gap-3">
              <Link to={`/edit-event/${id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold flex items-center gap-2">
                <FaEdit /> Edit
              </Link>
              <button onClick={() => setShowAnnouncement(!showAnnouncement)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold flex items-center gap-2">
                <FaBullhorn /> Announce
              </button>
            </div>
          </div>

          {/* ANNOUNCEMENT FORM */}
          {showAnnouncement && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Send Announcement</h2>
              <form onSubmit={handleSendAnnouncement} className="space-y-4">
                <input type="text" placeholder="Title" value={announcement.title}
                  onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500"
                  required />
                <textarea placeholder="Message" value={announcement.message}
                  onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-purple-500"
                  rows="4" required />
                <div className="flex gap-3">
                  <button type="submit" disabled={sending}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2">
                    {sending ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</> : "Send"}
                  </button>
                  <button type="button" onClick={() => setShowAnnouncement(false)}
                    className="bg-gray-200 px-5 py-2 rounded-lg hover:bg-gray-300">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Bookings", value: data.stats.totalBookings, sub: `${data.stats.confirmedBookings} confirmed`, icon: <FaTicketAlt /> },
              { label: "Revenue", value: `₹${data.stats.totalRevenue}`, icon: <FaDollarSign /> },
              { label: "Tickets", value: data.stats.ticketsSold, sub: `${data.stats.availableSeats} left`, icon: <FaUsers /> },
              { label: "Rating", value: data.stats.avgRating, sub: `${data.stats.totalReviews} reviews`, icon: <FaStar /> },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-blue-500 font-bold text-sm">{item.label}</p>
                    <h2 className="text-2xl font-bold text-gray-900">{item.value}</h2>
                    {item.sub && <p className="text-xs text-gray-500">{item.sub}</p>}
                  </div>
                  <div className="text-xl text-yellow-400">{item.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* TWO CARDS */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Ticket Stats</h2>
              {data.ticketTypeStats.map((ticket, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">{ticket.name}</span>
                    <span className="font-semibold text-gray-900">₹{ticket.price}</span>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>{ticket.sold}/{ticket.total}</span>
                    <span>₹{ticket.revenue}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded mt-1">
                    <div className="h-2 bg-blue-600 rounded" style={{ width: `${(ticket.sold / ticket.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-green-600">Announcements</h2>
              {announcements.length === 0 ? (
                <p className="text-gray-500">No announcements yet</p>
              ) : (
                announcements.slice(0, 5).map((ann) => (
                  <div key={ann._id} className="mb-3 border-b pb-2">
                    <p className="font-medium text-gray-900">{ann.title}</p>
                    <p className="text-sm text-blue-600">{ann.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BOOKINGS TABLE */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-gray-700">
                    <th className="py-2 text-left">Ref</th>
                    <th className="text-left">User</th>
                    <th className="text-left">Tickets</th>
                    <th className="text-left">Amount</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBookings.map((b) => (
                    <tr key={b._id} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-mono text-blue-700">{b.bookingReference}</td>
                      <td>
                        <div className="text-green-600 font-medium">{b.user.name}</div>
                        <div className="text-xs text-gray-500">{b.user.email}</div>
                      </td>
                      <td>
                        {b.tickets.map((t, i) => (
                          <div key={i} className="text-yellow-600">{t.quantity}x {t.ticketType}</div>
                        ))}
                      </td>
                      <td className="font-semibold text-gray-900">₹{b.totalAmount}</td>
                      <td>
                        <span className={`px-2 py-1 text-xs rounded font-semibold ${
                          b.status === "confirmed" ? "bg-green-100 text-green-700"
                          : b.status === "pending" ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EventDashboard;

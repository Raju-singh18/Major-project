import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash, FaCheckDouble } from 'react-icons/fa';
import { API_URL } from '../config/api';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/notifications/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchNotifications();
      // Trigger event to update navbar badge
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${API_URL}/notifications/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      fetchNotifications();
      // Trigger event to update navbar badge
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchNotifications();
      // Trigger event to update navbar badge
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking: '🎫',
      event_update: '📅',
      event_reminder: '⏰',
      cancellation: '❌',
      review: '⭐',
      wishlist: '❤️'
    };
    return icons[type] || '🔔';
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
        <p className="text-gray-700 font-medium text-lg">Loading notifications...</p>
      </div>
    </div>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-gray-600">
                    You have <span className="font-bold text-purple-600">{unreadCount}</span> unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              {notifications.some(n => !n.read) && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all font-bold"
                >
                  <FaCheckDouble /> Mark All Read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
              <FaBell className="text-6xl mx-auto mb-4 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600">When you get notifications, they'll show up here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`bg-white border rounded-2xl p-6 hover:border-purple-300 transition-all ${
                    !notification.read 
                      ? 'border-purple-400 border-2 shadow-lg' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-gray-900">{notification.title}</h3>
                            {!notification.read && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                                NEW
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-12 mb-3">{notification.message}</p>
                      {notification.relatedEvent && (
                        <Link
                          to={`/events/${notification.relatedEvent._id}`}
                          className="text-purple-600 hover:text-purple-700 font-semibold text-sm ml-12 inline-flex items-center gap-1 group"
                        >
                          View Event 
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-green-600 hover:text-white hover:bg-green-600 p-3 rounded-xl border-2 border-green-200 hover:border-green-600 transition-all"
                          title="Mark as read"
                        >
                          <FaCheck />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 p-3 rounded-xl border-2 border-red-200 hover:border-red-600 transition-all"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Section */}
          {notifications.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Total</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {unreadCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">Unread</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {notifications.filter(n => n.read).length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Read</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {notifications.filter(n => n.type === 'booking').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Bookings</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;

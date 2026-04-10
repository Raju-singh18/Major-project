import { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaUsers, FaCalendar, FaTicketAlt, FaDollarSign, FaUserTie, FaCheckCircle, FaEnvelope, FaChartLine, FaImage, FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaUpload, FaLink, FaFileAlt } from 'react-icons/fa';
import { API_URL } from '../config/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast, toasts, removeToast } = useToast();
  const slideImageRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState([]);
  const [slideForm, setSlideForm] = useState({ tag: '', heading: '', highlight: '', sub: '', image: '', order: 0, active: true });
  const [editingSlide, setEditingSlide] = useState(null);
  const [showSlideForm, setShowSlideForm] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'

  // confirm modal state
  const [confirmModal, setConfirmModal] = useState(null);
  // reject reason modal state
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // legal pages state
  const [legalType, setLegalType] = useState('privacy');
  const [legalData, setLegalData] = useState({ intro: '', sections: [], lastUpdated: '' });
  const [legalLoading, setLegalLoading] = useState(false);
  const [legalSaving, setLegalSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'legal') fetchLegalPage(legalType);
  }, [activeTab, legalType]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, organizersRes, eventsRes, reviewsRes, contactsRes, slidesRes] = await Promise.all([
        axios.get(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API_URL}/admin/organizers`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API_URL}/admin/events`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API_URL}/admin/reviews`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API_URL}/contact`, { headers: { Authorization: `Bearer ${user.token}` } }).catch(() => ({ data: { contacts: [] } })),
        axios.get(`${API_URL}/hero-slides/all`, { headers: { Authorization: `Bearer ${user.token}` } }).catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setOrganizers(organizersRes.data);
      setEvents(eventsRes.data);
      setReviews(reviewsRes.data);
      setContacts(contactsRes.data.contacts || []);
      setSlides(slidesRes.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to load dashboard data', 'error');
      setLoading(false);
    }
  };

  const fetchLegalPage = async (type) => {
    setLegalLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/legal/${type}`, { headers: { Authorization: `Bearer ${user.token}` } });
      setLegalData({ intro: data.intro || '', sections: data.sections || [], lastUpdated: data.lastUpdated || '' });
    } catch {
      showToast('❌ Failed to load legal page', 'error');
    } finally {
      setLegalLoading(false);
    }
  };

  const saveLegalPage = async () => {
    setLegalSaving(true);
    try {
      await axios.put(`${API_URL}/legal/${legalType}`, legalData, { headers: { Authorization: `Bearer ${user.token}` } });
      showToast('✅ Legal page saved successfully', 'success');
    } catch {
      showToast('❌ Failed to save legal page', 'error');
    } finally {
      setLegalSaving(false);
    }
  };

  const updateSection = (i, field, value) => {
    const updated = [...legalData.sections];
    updated[i] = { ...updated[i], [field]: value };
    setLegalData(prev => ({ ...prev, sections: updated }));
  };

  const addSection = () => {
    setLegalData(prev => ({ ...prev, sections: [...prev.sections, { title: '', content: '' }] }));
  };

  const removeSection = (i) => {
    setLegalData(prev => ({ ...prev, sections: prev.sections.filter((_, idx) => idx !== i) }));
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(
        `${API_URL}/admin/users/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showToast('✅ User role updated successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('❌ Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirmModal({
      message: 'Are you sure you want to delete this user? This cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/admin/users/${userId}`, { headers: { Authorization: `Bearer ${user.token}` } });
          showToast('✅ User deleted successfully', 'success');
          fetchData();
        } catch { showToast('❌ Failed to delete user', 'error'); }
        setConfirmModal(null);
      }
    });
  };

  const handleSuspendUser = async (userId) => {
    try {
      await axios.put(
        `${API_URL}/admin/users/${userId}/suspend`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showToast('✅ User suspended successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('❌ Failed to suspend user', 'error');
    }
  };

  const handleUnsuspendUser = async (userId) => {
    try {
      await axios.put(
        `${API_URL}/admin/users/${userId}/unsuspend`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showToast('✅ User unsuspended successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('❌ Failed to unsuspend user', 'error');
    }
  };

  const handleApproveEvent = async (eventId) => {
    try {
      await axios.put(
        `${API_URL}/admin/events/${eventId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showToast('✅ Event approved successfully', 'success');
      fetchData();
    } catch (error) {
      showToast('❌ Failed to approve event', 'error');
    }
  };

  const handleRejectEvent = (eventId) => {
    setRejectReason('');
    setRejectModal(eventId);
  };

  const submitRejectEvent = async () => {
    if (!rejectReason.trim()) { showToast('❌ Please enter a rejection reason', 'error'); return; }
    try {
      await axios.put(`${API_URL}/admin/events/${rejectModal}/reject`, { reason: rejectReason }, { headers: { Authorization: `Bearer ${user.token}` } });
      showToast('✅ Event rejected', 'success');
      setRejectModal(null);
      fetchData();
    } catch { showToast('❌ Failed to reject event', 'error'); }
  };

  const handleDeleteEvent = (eventId) => {
    setConfirmModal({
      message: 'Delete this event? All associated bookings will also be removed.',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/admin/events/${eventId}`, { headers: { Authorization: `Bearer ${user.token}` } });
          showToast('✅ Event deleted successfully', 'success');
          fetchData();
        } catch { showToast('❌ Failed to delete event', 'error'); }
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteReview = (reviewId) => {
    setConfirmModal({
      message: 'Delete this review permanently?',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/admin/reviews/${reviewId}`, { headers: { Authorization: `Bearer ${user.token}` } });
          showToast('✅ Review deleted successfully', 'success');
          fetchData();
        } catch { showToast('❌ Failed to delete review', 'error'); }
        setConfirmModal(null);
      }
    });
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await axios.put(
        `${API_URL}/contact/${contactId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      showToast('✅ Contact status updated', 'success');
      fetchData();
    } catch (error) {
      showToast('❌ Failed to update contact status', 'error');
    }
  };

  const handleDeleteContact = (contactId) => {
    setConfirmModal({
      message: 'Delete this contact submission?',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/contact/${contactId}`, { headers: { Authorization: `Bearer ${user.token}` } });
          showToast('✅ Contact deleted successfully', 'success');
          fetchData();
        } catch { showToast('❌ Failed to delete contact', 'error'); }
        setConfirmModal(null);
      }
    });
  };

  const BLANK_SLIDE = { tag: '', heading: '', highlight: '', sub: '', image: '', order: 0, active: true };

  const openCreateSlide = () => { setEditingSlide(null); setSlideForm(BLANK_SLIDE); setImageMode('upload'); setShowSlideForm(true); };
  const openEditSlide = (s) => { setEditingSlide(s._id); setSlideForm({ tag: s.tag, heading: s.heading, highlight: s.highlight, sub: s.sub, image: s.image, order: s.order, active: s.active }); setImageMode('url'); setShowSlideForm(true); };

  const handleSaveSlide = async () => {
    if (!slideForm.tag || !slideForm.heading || !slideForm.highlight || !slideForm.sub || !slideForm.image) {
      showToast('❌ All fields are required', 'error'); return;
    }
    try {
      if (editingSlide) {
        await axios.put(`${API_URL}/hero-slides/${editingSlide}`, slideForm, { headers: { Authorization: `Bearer ${user.token}` } });
        showToast('✅ Slide updated', 'success');
      } else {
        await axios.post(`${API_URL}/hero-slides`, slideForm, { headers: { Authorization: `Bearer ${user.token}` } });
        showToast('✅ Slide created', 'success');
      }
      setShowSlideForm(false);
      fetchData();
    } catch (err) {
      showToast('❌ Failed to save slide', 'error');
    }
  };

  const handleDeleteSlide = (id) => {
    setConfirmModal({
      message: 'Delete this hero slide?',
      onConfirm: async () => {
        try {
          await axios.delete(`${API_URL}/hero-slides/${id}`, { headers: { Authorization: `Bearer ${user.token}` } });
          showToast('✅ Slide deleted', 'success');
          fetchData();
        } catch { showToast('❌ Failed to delete slide', 'error'); }
        setConfirmModal(null);
      }
    });
  };

  const handleToggleSlide = async (s) => {
    try {
      await axios.put(`${API_URL}/hero-slides/${s._id}`, { ...s, active: !s.active }, { headers: { Authorization: `Bearer ${user.token}` } });
      showToast(`✅ Slide ${!s.active ? 'activated' : 'deactivated'}`, 'success');
      fetchData();
    } catch (err) {
      showToast('❌ Failed to update slide', 'error');
    }
  };

  const handleSlideImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showToast('❌ Only JPEG, PNG, WebP images are allowed', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('❌ Image must be under 5MB', 'error');
      return;
    }

    setImageUploading(true);
    showToast('⏳ Uploading image to Cloudinary...', 'info');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await axios.post(`${API_URL}/upload/image`, fd, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' }
      });
      setSlideForm(prev => ({ ...prev, image: data.url }));
      showToast('✅ Image uploaded successfully', 'success');
    } catch (err) {
      showToast('❌ Image upload failed. Try again.', 'error');
    } finally {
      setImageUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-9 w-64 bg-gray-200 rounded-xl animate-pulse mb-2"></div>
          <div className="h-4 w-80 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-7 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs skeleton */}
        <div className="mb-6">
          <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl p-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`h-10 rounded-xl animate-pulse bg-gray-200 ${i === 0 ? 'w-28' : 'w-20'}`}></div>
            ))}
          </div>
        </div>

        {/* Content skeleton — two cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse mb-5"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="border-b border-gray-100 pb-3 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
    <div className="min-h-screen pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12 bg-gray-50">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            👑 Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage users, events, and platform operations</p>
        </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-semibold">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <FaUsers className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-semibold">Organizers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalOrganizers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
              <FaUserTie className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-semibold">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEvents || 0}</p>
              <p className="text-xs text-green-600 font-semibold">{stats?.publishedEvents || 0} published</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FaCalendar className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-semibold">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingEvents || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
              <FaChartLine className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-semibold">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
              <p className="text-xs text-green-600 font-semibold">{stats?.confirmedBookings || 0} confirmed</p>
            </div>
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
              <FaTicketAlt className="text-white text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1 font-semibold">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <FaDollarSign className="text-white text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-1 flex-wrap bg-white border border-gray-200 rounded-2xl p-2 overflow-x-auto">
          {['overview', 'users', 'organizers', 'events', 'reviews', 'contacts', 'slider', 'legal'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-sm font-semibold capitalize rounded-xl transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span>🏆</span> Top Events
            </h2>
            <div className="space-y-3">
              {stats?.topEvents && stats.topEvents.length > 0 ? (
                stats.topEvents.map((event, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="font-semibold text-gray-900">{event._id?.title || 'Untitled Event'}</div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{event.bookings} bookings</span>
                      <span className="text-green-600 font-semibold">₹{event.revenue}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No events data available</p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span>👥</span> Recent Users
            </h2>
            <div className="space-y-3">
              {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((u) => (
                  <div key={u._id} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="font-semibold text-gray-900">{u.name}</div>
                    <div className="text-sm text-gray-600">{u.email}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-lg mr-2">
                        {u.role}
                      </span>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent users</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span>👤</span> User Management
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Name</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Email</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Role</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{u.name}</td>
                    <td className="py-3 px-4 text-gray-600">{u.email}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-3 py-1 bg-white border-2 border-gray-300 rounded-lg text-gray-900 focus:border-purple-500 focus:outline-none"
                        disabled={u._id === user._id}
                      >
                        <option value="user">User</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        u.suspended ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {u.suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {u._id !== user._id && (
                        <div className="flex gap-2">
                          {u.suspended ? (
                            <button
                              onClick={() => handleUnsuspendUser(u._id)}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                            >
                              Unsuspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSuspendUser(u._id)}
                              className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
                            >
                              Suspend
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Organizers Tab */}
      {activeTab === 'organizers' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span>✨</span> Organizer Management
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Name</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Email</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Events</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Bookings</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((org) => (
                  <tr key={org._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{org.name}</td>
                    <td className="py-3 px-4 text-gray-600">{org.email}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {org.stats.totalEvents} ({org.stats.publishedEvents} published)
                    </td>
                    <td className="py-3 px-4 text-gray-600">{org.stats.totalBookings}</td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      ${org.stats.totalRevenue}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {org.suspended ? (
                          <button
                            onClick={() => handleUnsuspendUser(org._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                          >
                            Unsuspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspendUser(org._id)}
                            className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span>📅</span> Event Management
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Title</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Organizer</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Date</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Seats</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{event.title}</td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900 font-medium">{event.organizer.name}</div>
                      <div className="text-xs text-gray-500">{event.organizer.email}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        event.status === 'published' ? 'bg-green-100 text-green-700 border border-green-200' :
                        event.status === 'draft' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        event.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                        'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {event.availableSeats} / {event.totalSeats}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {event.status === 'draft' && (
                          <button
                            onClick={() => handleApproveEvent(event._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        {event.status !== 'cancelled' && (
                          <button
                            onClick={() => handleRejectEvent(event._id)}
                            className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span>⭐</span> Review Management
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">{review.user.name}</div>
                    <div className="text-sm text-gray-600">{review.event.title}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contacts Tab */}
      {activeTab === 'contacts' && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
            <span>✉️</span> Contact Submissions
          </h2>
          <div className="space-y-4">
            {contacts && contacts.length > 0 ? (
              contacts.map((contact) => (
                <div key={contact._id} className="border border-gray-200 rounded-2xl p-4 hover:border-purple-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.email}</div>
                      <div className="mt-2">
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold mr-2">
                          {contact.subject}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                          contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          contact.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                          contact.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {contact.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={contact.status}
                        onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)}
                        className="px-3 py-1 bg-white border-2 border-gray-300 rounded-lg text-gray-900 text-sm focus:border-purple-500 focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                      <button
                        onClick={() => handleDeleteContact(contact._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-2">
                    <p className="text-gray-700 text-sm">{contact.message}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(contact.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No contact submissions yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slider Tab */}
      {activeTab === 'slider' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaImage className="text-purple-600" /> Hero Slider Management
              </h2>
              <button onClick={openCreateSlide} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
                <FaPlus /> Add Slide
              </button>
            </div>

            {/* Slide Form Modal */}
            {showSlideForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h3>
                    <button onClick={() => setShowSlideForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FaTimes /></button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tag / Category</label>
                        <input value={slideForm.tag} onChange={e => setSlideForm({...slideForm, tag: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          placeholder="e.g. Music & Concerts" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Order</label>
                        <input type="number" value={slideForm.order} onChange={e => setSlideForm({...slideForm, order: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Heading</label>
                      <input value={slideForm.heading} onChange={e => setSlideForm({...slideForm, heading: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                        placeholder="e.g. Discover Amazing" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Highlight (gradient text)</label>
                      <input value={slideForm.highlight} onChange={e => setSlideForm({...slideForm, highlight: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                        placeholder="e.g. Events Near You" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                      <textarea value={slideForm.sub} onChange={e => setSlideForm({...slideForm, sub: e.target.value})} rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none"
                        placeholder="Short description shown below the heading..." />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Slide Image</label>

                      {/* Toggle upload vs URL */}
                      <div className="flex gap-2 mb-3">
                        <button type="button" onClick={() => setImageMode('upload')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${imageMode === 'upload' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}>
                          <FaUpload className="text-xs" /> Upload File
                        </button>
                        <button type="button" onClick={() => setImageMode('url')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold border ${imageMode === 'url' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}>
                          <FaLink className="text-xs" /> Paste URL
                        </button>
                      </div>

                      {imageMode === 'upload' ? (
                        <div>
                          <input ref={slideImageRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleSlideImageUpload} />
                          <button type="button" onClick={() => slideImageRef.current?.click()} disabled={imageUploading}
                            className="w-full flex items-center justify-center gap-2 py-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 text-gray-500 hover:text-purple-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                            {imageUploading ? (
                              <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                Uploading to Cloudinary...
                              </>
                            ) : (
                              <>
                                <FaUpload />
                                Click to upload image (JPEG, PNG, WebP — max 5MB)
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <input value={slideForm.image} onChange={e => setSlideForm({...slideForm, image: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          placeholder="https://images.unsplash.com/..." />
                      )}

                      {/* Preview */}
                      {slideForm.image && (
                        <div className="mt-3 relative">
                          <img src={slideForm.image} alt="preview" className="h-36 w-full object-cover rounded-xl border border-gray-200"
                            onError={e => { e.target.style.display = 'none'; }} />
                          <button type="button" onClick={() => setSlideForm(prev => ({ ...prev, image: '' }))}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="slideActive" checked={slideForm.active} onChange={e => setSlideForm({...slideForm, active: e.target.checked})} className="w-4 h-4 accent-purple-600" />
                      <label htmlFor="slideActive" className="text-sm font-semibold text-gray-700">Active (visible on homepage)</label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={handleSaveSlide} className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
                      <FaSave /> {editingSlide ? 'Update Slide' : 'Create Slide'}
                    </button>
                    <button onClick={() => setShowSlideForm(false)} className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Slides List */}
            {slides.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                <FaImage className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No slides yet. Add your first slide.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((s) => (
                  <div key={s._id} className={`flex gap-4 items-start border rounded-2xl p-4 ${s.active ? 'border-gray-200' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <img src={s.image} alt={s.heading} className="w-32 h-20 object-cover rounded-xl flex-shrink-0 border border-gray-200" onError={e => { e.target.src = 'https://via.placeholder.com/128x80?text=No+Image'; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{s.tag}</span>
                        <span className="text-xs text-gray-400">Order: {s.order}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {s.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 truncate">{s.heading} <span className="text-purple-600">{s.highlight}</span></p>
                      <p className="text-sm text-gray-500 truncate">{s.sub}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleToggleSlide(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${s.active ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                        {s.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => openEditSlide(s)} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200 flex items-center gap-1">
                        <FaEdit /> Edit
                      </button>
                      <button onClick={() => handleDeleteSlide(s._id)} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legal Pages Tab */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          {/* Type switcher */}
          <div className="flex gap-3">
            {['privacy', 'terms'].map(t => (
              <button key={t} onClick={() => setLegalType(t)}
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm capitalize transition-colors ${legalType === t ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-400'}`}>
                {t === 'privacy' ? '🔒 Privacy Policy' : '📄 Terms of Service'}
              </button>
            ))}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaFileAlt className="text-purple-600" />
                {legalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <button onClick={saveLegalPage} disabled={legalSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-60 transition-colors">
                <FaSave className="text-sm" /> {legalSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {legalLoading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-5">
                {/* Last Updated */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Updated Date</label>
                  <input value={legalData.lastUpdated} onChange={e => setLegalData(p => ({ ...p, lastUpdated: e.target.value }))}
                    placeholder="e.g. January 1, 2025"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm" />
                </div>

                {/* Intro */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Introduction Paragraph</label>
                  <textarea value={legalData.intro} onChange={e => setLegalData(p => ({ ...p, intro: e.target.value }))}
                    rows={3} placeholder="Brief intro shown at the top of the page..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm resize-none" />
                </div>

                {/* Sections */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">Sections</label>
                    <button onClick={addSection}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors">
                      <FaPlus className="text-xs" /> Add Section
                    </button>
                  </div>

                  <div className="space-y-4">
                    {legalData.sections.map((section, i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Section {i + 1}</span>
                          <button onClick={() => removeSection(i)}
                            className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                            <FaTrash className="text-xs" />
                          </button>
                        </div>
                        <input value={section.title} onChange={e => updateSection(i, 'title', e.target.value)}
                          placeholder="Section title (e.g. 1. Information We Collect)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2" />
                        <textarea value={section.content} onChange={e => updateSection(i, 'content', e.target.value)}
                          rows={4} placeholder="Section content... (use • for bullets, new lines are preserved)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button onClick={saveLegalPage} disabled={legalSaving}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-60 transition-colors">
                    <FaSave /> {legalSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>

      {/* Generic Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-full max-w-md text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-500 text-sm mb-6">{confirmModal.message}</p>
            <div className="flex gap-3">
              <button onClick={confirmModal.onConfirm}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">
                Confirm
              </button>
              <button onClick={() => setConfirmModal(null)}
                className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Event Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Event</h3>
            <p className="text-gray-500 text-sm mb-3">Provide a reason so the organizer knows what to fix.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={submitRejectEvent}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">
                Reject Event
              </button>
              <button onClick={() => setRejectModal(null)}
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

export default AdminDashboard;


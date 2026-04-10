import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import {
  FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaCamera,
  FaTimes, FaLock, FaCheckCircle, FaTrash, FaExclamationTriangle
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { toasts, success, error: toastError, removeToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', bio: '', address: '', avatar: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setFormData({ name: data.name, email: data.email, phone: data.phone || '', bio: data.bio || '', address: data.address || '', avatar: data.avatar || '', password: '' });
      setAvatarPreview(data.avatar || '');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarClick = () => { if (editing) fileInputRef.current?.click(); };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.post('/upload/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData(prev => ({ ...prev, avatar: data.url }));
      setAvatarPreview(data.url);
      success('✅ Avatar updated!');
    } catch (err) {
      toastError(err.response?.data?.message || 'Avatar upload failed');
      setAvatarPreview(formData.avatar);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: formData.name, email: formData.email, phone: formData.phone, bio: formData.bio, avatar: formData.avatar };
      if (formData.password) payload.password = formData.password;
      const { data } = await api.put('/auth/profile', payload);
      updateUser({ name: data.name, email: data.email, avatar: data.avatar, token: data.token });
      success('✅ Profile updated successfully!');
      setEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    fetchProfile();
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) { setDeleteError('Please enter your password to confirm.'); return; }
    setDeleting(true);
    setDeleteError('');
    try {
      await api.delete('/auth/account', { data: { password: deletePassword } });
      logout();
      navigate('/');
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const initials = formData.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen pt-20 sm:pt-20 sm:pt-28 pb-8 sm:pb-12 bg-gray-50">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT — Avatar Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div
                    onClick={handleAvatarClick}
                    className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${editing ? 'border-purple-400 cursor-pointer' : 'border-gray-200 cursor-default'}`}
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt={formData.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-purple-600 flex items-center justify-center text-white text-2xl sm:text-2xl sm:text-3xl md:text-4xl font-bold">
                        {initials}
                      </div>
                    )}
                    {editing && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                        {avatarUploading ? (
                          <svg className="animate-spin h-7 w-7 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <>
                            <FaCamera className="text-white text-2xl" />
                            <span className="text-white text-xs font-semibold">Change</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.name || '—'}</h2>
                <p className="text-gray-500 text-sm mb-4">{formData.email}</p>

                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-white ${
                  user?.role === 'admin' ? 'bg-purple-700'
                  : user?.role === 'organizer' ? 'bg-orange-500'
                  : 'bg-purple-600'
                }`}>
                  {user?.role === 'admin' ? '👑 Admin' : user?.role === 'organizer' ? '✨ Organizer' : '👤 User'}
                </span>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Active Account
                </div>

                {!editing && (
                  <button onClick={() => setEditing(true)}
                    className="mt-6 w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700">
                    <FaEdit /> Edit Profile
                  </button>
                )}
                {editing && <p className="mt-4 text-xs text-purple-600 font-medium">Click on your avatar to change photo</p>}
              </div>
            </div>

            {/* RIGHT — Form Card */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <FaUser className="text-purple-600" /> Personal Information
                </h3>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!editing} placeholder="Your full name"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!editing} placeholder="your@email.com"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!editing} placeholder="+91 98765 43210"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">Bio</label>
                    <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!editing} rows={4} maxLength={500} placeholder="Tell us a little about yourself..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-none" />
                    {editing && <p className="text-xs text-gray-400 mt-1 text-right">{formData.bio.length}/500</p>}
                  </div>

                  {editing && (
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">
                        New Password <span className="text-xs text-gray-400 font-normal">(leave blank to keep current)</span>
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="••••••••" minLength={6}
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                    </div>
                  )}

                  {editing && (
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                      <button type="submit" disabled={saving || avatarUploading}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        {saving ? (
                          <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Saving...</>
                        ) : <><FaSave /> Save Changes</>}
                      </button>
                      <button type="button" onClick={handleCancel}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-400">
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Tips */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="text-gray-900 font-bold mb-1">Profile Tips</h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500 flex-shrink-0" /> Upload a clear profile photo (JPEG, PNG, WebP — max 3MB)</li>
                      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500 flex-shrink-0" /> Add your phone number for event reminders</li>
                      <li className="flex items-center gap-2"><FaCheckCircle className="text-green-500 flex-shrink-0" /> Write a short bio so organizers know who you are</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-6 bg-white border border-red-200 rounded-2xl p-6">
                <h4 className="text-red-600 font-bold mb-1 flex items-center gap-2">
                  <FaExclamationTriangle /> Danger Zone
                </h4>
                <p className="text-gray-500 text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button onClick={() => { setShowDeleteModal(true); setDeletePassword(''); setDeleteError(''); }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-300 text-red-600 rounded-xl font-bold hover:bg-red-100 text-sm">
                  <FaTrash /> Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 sm:p-8 w-full max-w-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaTrash className="text-red-600 text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-500">This action is permanent and cannot be undone.</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-red-700 font-medium mb-2">⚠️ What will be deleted:</p>
                <ul className="text-sm text-red-600 space-y-1 ml-4 list-disc">
                  <li>Your profile and personal information</li>
                  <li>All your bookings and history</li>
                  <li>Your wishlist and saved events</li>
                  <li>All notifications and reviews</li>
                </ul>
              </div>

              <div className="mb-5">
                <label className="block text-gray-700 font-semibold mb-2 text-sm">Enter your password to confirm</label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="password" value={deletePassword}
                    onChange={(e) => { setDeletePassword(e.target.value); setDeleteError(''); }}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                    placeholder="Enter your password" autoFocus />
                </div>
                {deleteError && (
                  <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                    <FaExclamationTriangle className="flex-shrink-0" /> {deleteError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} disabled={deleting || !deletePassword}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  {deleting ? (
                    <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Deleting...</>
                  ) : <><FaTrash /> Delete My Account</>}
                </button>
                <button onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;


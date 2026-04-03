import { useState, useEffect, useContext, useRef } from 'react';
import api from '../config/api';
import { AuthContext } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaCamera, FaTimes, FaLock, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', bio: '', avatar: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/profile');
      setFormData({ name: data.name, email: data.email, phone: data.phone || '', bio: data.bio || '', avatar: data.avatar || '', password: '' });
      setAvatarPreview(data.avatar || '');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAvatarClick = () => {
    if (editing) fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setAvatarUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.post('/upload/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, avatar: data.url }));
      setAvatarPreview(data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Avatar upload failed');
      setAvatarPreview(formData.avatar); // revert preview
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = { name: formData.name, email: formData.email, phone: formData.phone, bio: formData.bio, avatar: formData.avatar };
      if (formData.password) payload.password = formData.password;

      const { data } = await api.put('/auth/profile', payload);

      // Update context + localStorage so navbar avatar/name refreshes
      updateUser({ name: data.name, email: data.email, avatar: data.avatar, token: data.token });

      setSuccess('Profile updated successfully!');
      setEditing(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
    fetchProfile();
  };

  const initials = formData.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="min-h-screen pt-28 pb-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <p className="font-medium">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-center gap-3">
            <FaCheckCircle className="text-xl flex-shrink-0" />
            <p className="font-medium">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT — Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div
                  onClick={handleAvatarClick}
                  className={`relative w-32 h-32 rounded-full overflow-hidden border-4 ${editing ? 'border-purple-400 cursor-pointer' : 'border-gray-200 cursor-default'}`}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt={formData.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                      {initials}
                    </div>
                  )}

                  {/* Overlay when editing */}
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

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{formData.name || '—'}</h2>
              <p className="text-gray-500 text-sm mb-4">{formData.email}</p>

              {/* Role badge */}
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold text-white ${
                user?.role === 'admin' ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                : user?.role === 'organizer' ? 'bg-gradient-to-r from-orange-500 to-red-500'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600'
              }`}>
                {user?.role === 'admin' ? '👑 Admin' : user?.role === 'organizer' ? '✨ Organizer' : '👤 User'}
              </span>

              {/* Status */}
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active Account
              </div>

              {/* Edit button */}
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700"
                >
                  <FaEdit /> Edit Profile
                </button>
              )}

              {editing && (
                <p className="mt-4 text-xs text-purple-600 font-medium">
                  Click on your avatar to change photo
                </p>
              )}
            </div>
          </div>

          {/* RIGHT — Form Card */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaUser className="text-purple-600" />
                Personal Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!editing}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!editing}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-none"
                    placeholder="Tell us a little about yourself..."
                  />
                  {editing && (
                    <p className="text-xs text-gray-400 mt-1 text-right">{formData.bio.length}/500</p>
                  )}
                </div>

                {/* New Password — only when editing */}
                {editing && (
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm flex items-center gap-2">
                      <FaLock className="text-purple-600" />
                      New Password
                      <span className="text-xs text-gray-400 font-normal">(leave blank to keep current)</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="••••••••"
                        minLength={6}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                  </div>
                )}

                {/* Action Buttons */}
                {editing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="submit"
                      disabled={saving || avatarUploading}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <><FaSave /> Save Changes</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:border-gray-400"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Info Card */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaLock, FaCheckCircle, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { API_URL } from '../config/api';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password
      });
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 pt-32 pb-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:block">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <FaCalendarAlt className="text-white text-4xl" />
          </div>

          <h1 className="text-5xl font-bold mb-4 text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>
            {success ? 'Password' : 'Create New'}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
              {success ? 'Reset!' : 'Password'}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {success 
              ? "Your password has been successfully reset. You can now login with your new password."
              : "Choose a strong password to keep your account secure. Use a mix of letters, numbers, and symbols."
            }
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Minimum 6 characters</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Secure encryption</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Instant activation</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10">
            {!success ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaLock className="text-white text-2xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Reset Password
                  </h2>
                  <p className="text-gray-600">Enter your new password below</p>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
                    <p className="font-medium">⚠️ {error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">New Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Must be at least 6 characters</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Confirm Password</label>
                    <div className="relative">
                      <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting...
                      </>
                    ) : (
                      <>
                        <FaLock />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    <FaArrowLeft />
                    Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-white text-4xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Password Reset Successful!
                </h2>
                <p className="text-gray-700 mb-6 text-lg">
                  Your password has been reset successfully.
                </p>
                <p className="text-gray-600 mb-8">
                  You can now login with your new password. Redirecting to login page...
                </p>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-800">
                    ✓ <strong>Success!</strong> Your account is now secure with the new password.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Secure Process</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

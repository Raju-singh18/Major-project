import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaCheckCircle, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { API_URL } from '../config/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-32 pb-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:block">
          <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <FaCalendarAlt className="text-white text-4xl" />
          </div>

          <h1 className="text-3xl sm:text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900" style={{ fontFamily: "Poppins, sans-serif" }}>
            {success ? 'Check Your' : 'Reset Your'}
            <span className="bg-purple-600 bg-clip-text text-transparent block mt-2">
              {success ? 'Email' : 'Password'}
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {success 
              ? "We've sent you a password reset link. Check your inbox and follow the instructions."
              : "Don't worry! Enter your email address and we'll send you a link to reset your password."
            }
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Secure password reset</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Link expires in 1 hour</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Email sent instantly</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-5 sm:p-8 md:p-10">
            {!success ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="text-white text-2xl" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Forgot Password?
                  </h2>
                  <p className="text-gray-600">Enter your email to receive a reset link</p>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
                    <p className="font-medium">⚠️ {error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-semibold">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaEnvelope />
                        Send Reset Link
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
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-white text-4xl" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Check Your Email!
                </h2>
                <p className="text-gray-700 mb-4 text-lg">
                  We've sent a password reset link to
                </p>
                <p className="text-purple-600 font-bold text-lg mb-6">
                  {email}
                </p>
                <p className="text-gray-600 mb-8">
                  Please check your inbox and click the link to reset your password. The link will expire in 1 hour.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> If you don't see the email, check your spam folder.
                  </p>
                </div>

                <Link
                  to="/login"
                  className="inline-block w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
                >
                  Back to Login
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

export default ForgotPassword;


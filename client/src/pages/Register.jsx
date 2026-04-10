import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaCalendarAlt,
  FaTicketAlt,
  FaCalendarPlus,
  FaCheckCircle,
  FaUserPlus,
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password, confirmPassword, role } = formData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register(name, email, password, role);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.message ||
          err.response?.data?.message ||
          "Registration failed. Try again."
      );
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
            Join
            <span className="bg-purple-600 bg-clip-text text-transparent block mt-2">
              EventMe Today
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create your account and start discovering amazing events or organizing your own in minutes.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Free forever plan</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-white" />
              </div>
              <span className="text-gray-700 font-medium">Start creating events instantly</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - REGISTER FORM */}
        <div className="w-full">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-5 sm:p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                Create Your Account
              </h2>
              <p className="text-gray-600">Sign up to start your journey with EventMe</p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6">
                <p className="font-medium">⚠️ {error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl mb-6">
                <p className="font-medium">✅ Account created successfully! Redirecting...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors placeholder-gray-400"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors placeholder-gray-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors placeholder-gray-400"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-semibold">Confirm Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors placeholder-gray-400"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-3 font-semibold">I want to</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "user" })}
                    className={`p-6 rounded-2xl border-2 ${
                      formData.role === "user"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-300 bg-white hover:border-purple-300"
                    }`}
                  >
                    <FaTicketAlt className={`text-3xl mx-auto mb-3 ${formData.role === "user" ? "text-purple-600" : "text-gray-400"}`} />
                    <p className={`font-bold ${formData.role === "user" ? "text-purple-600" : "text-gray-600"}`}>
                      Book Events
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Discover & attend events</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "organizer" })}
                    className={`p-6 rounded-2xl border-2 ${
                      formData.role === "organizer"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-300 bg-white hover:border-orange-300"
                    }`}
                  >
                    <FaCalendarPlus className={`text-3xl mx-auto mb-3 ${formData.role === "organizer" ? "text-orange-600" : "text-gray-400"}`} />
                    <p className={`font-bold ${formData.role === "organizer" ? "text-orange-600" : "text-gray-600"}`}>
                      Create Events
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Organize & manage events</p>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : success ? (
                  <>✓ Account Created!</>
                ) : (
                  <>
                    <FaUserPlus />
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
                </div>
              </div>

              <Link
                to="/login"
                className="inline-block w-full px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-purple-500 hover:text-purple-600"
              >
                Login Instead →
              </Link>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600 flex-wrap">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Secure Registration</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


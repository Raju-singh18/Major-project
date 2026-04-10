import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaCheckCircle } from 'react-icons/fa';
import api from '../config/api';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [contactInfo, setContactInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  useEffect(() => {
    api.get('/admin/contact-info')
      .then(({ data }) => setContactInfo(data))
      .catch(() => {});
  }, []);

  const goToFaq = () => navigate('/contact#faq');
  const goToChat = () => navigate('/contact', { state: { openChat: true } });

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-6 sm:mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <span className="font-display text-2xl font-bold text-purple-600">EventMe</span>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover and book amazing events near you. Create unforgettable experiences with EventMe.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-colors">
                <FaTwitter />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-colors">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-colors">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/events" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full transition-colors"></span>
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/suggestions" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full transition-colors"></span>
                  Suggestions
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full transition-colors"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full transition-colors"></span>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/wishlists" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full transition-colors"></span>
                  Wishlists
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <button onClick={goToFaq} className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 w-full text-left">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0"></span>
                  Help Center / FAQ
                </button>
              </li>
              <li>
                <button onClick={goToChat} className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 w-full text-left">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0"></span>
                  Live Chat Support
                </button>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-services" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gray-900">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-600">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <a href={`mailto:${contactInfo?.email || 'support@eventme.com'}`} className="hover:text-purple-600 transition-colors font-medium">
                    {contactInfo?.email || 'support@eventme.com'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Phone</div>
                  <a href={`tel:${contactInfo?.phone || ''}`} className="hover:text-purple-600 transition-colors font-medium">
                    {contactInfo?.phone || '+91 0000000000'}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <span className="font-medium">{contactInfo?.address || 'EventMe HQ'}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-200 pt-12 mb-6 sm:mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Stay Updated</h3>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest events and exclusive offers</p>
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <FaCheckCircle /> You're subscribed! Thanks for joining.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button type="submit" className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} EventMe. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              Made with <FaHeart className="text-red-500" /> by EventMe Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



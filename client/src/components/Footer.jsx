import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <FaCalendarAlt className="text-white text-xl" />
              </div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">EventMe</span>
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Discover and book amazing events near you. Create unforgettable experiences with EventMe.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaTwitter />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 hover:bg-purple-600 text-gray-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110">
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
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/suggestions" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  Suggestions
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/wishlists" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
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
                <Link to="/contact" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                  FAQ
                </a>
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
                  <a href="mailto:support@eventme.com" className="hover:text-purple-600 transition-colors font-medium">
                    support@eventme.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Phone</div>
                  <a href="tel:+1234567890" className="hover:text-purple-600 transition-colors font-medium">
                    +1 (234) 567-8900
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-600">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <span className="font-medium">New York, NY 10001</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-200 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Stay Updated</h3>
            <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest events and exclusive offers</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {currentYear} EventMe. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-2">
              Made with <FaHeart className="text-red-500 animate-pulse" /> by EventMe Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

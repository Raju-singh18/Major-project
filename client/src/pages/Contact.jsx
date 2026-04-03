import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaComments, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import { useToast } from '../hooks/useToast';
import api from '../config/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/contact', formData);
      
      if (response.data.success) {
        setSubmitted(true);
        showToast('✉️ Message sent successfully! We\'ll respond within 24 hours.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showToast(
        error.response?.data?.message || '❌ Failed to send message. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="pt-28 pb-12">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 px-4 py-2 rounded-full mb-5">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm text-green-700">We're Online - Ready to Help</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about EventMe? We're here to help you succeed.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="container mx-auto px-4 sm:px-6 mb-12 max-w-6xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email Support */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-purple-300 hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-3 leading-relaxed text-sm">
              Get detailed answers within 24 hours
            </p>
            <a 
              href="mailto:support@eventme.com" 
              className="inline-block text-purple-600 font-semibold hover:text-purple-700 transition-colors text-sm"
            >
              support@eventme.com
            </a>
          </div>

          {/* Live Chat */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-purple-300 hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-3 leading-relaxed text-sm">
              Instant help Mon-Fri, 9 AM - 6 PM EST
            </p>
            <button className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all text-sm">
              Start Chat
            </button>
          </div>

          {/* Phone Support */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-purple-300 hover:scale-105 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-white text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3 leading-relaxed text-sm">
              Speak with our support team directly
            </p>
            <a 
              href="tel:+12345678900" 
              className="inline-block text-purple-600 font-semibold hover:text-purple-700 transition-colors text-sm"
            >
              +1 (234) 567-8900
            </a>
          </div>
        </div>
      </div>

      {/* Main Content - Form & Info */}
      <div className="container mx-auto px-4 sm:px-6 pb-16 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600">Fill out the form and we'll get back to you within 24 hours.</p>
              </div>

              {submitted && (
                <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 mb-6 flex items-start gap-3">
                  <FaCheckCircle className="text-green-600 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Message Sent!</h4>
                    <p className="text-sm text-green-800">We'll respond within 24 hours.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    👤 Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    ✉️ Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    📋 Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none transition-all"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    💬 Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl focus:border-purple-500 focus:outline-none transition-all resize-none"
                    rows="5"
                    placeholder="Tell us how we can help you..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 text-center pt-2">
                  🔒 Your information will never be shared.
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar - Contact Info & FAQ */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
            
            {/* Contact Information Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-purple-600" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Email</h4>
                    <p className="text-gray-600 text-sm">support@eventme.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Phone</h4>
                    <p className="text-gray-600 text-sm">+1 (234) 567-8900</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Office</h4>
                    <p className="text-gray-600 text-sm">New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaQuestionCircle className="text-orange-600" />
                Quick Answers
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 text-sm group">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                    How do I book tickets?
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 text-sm group">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                    Can I cancel my booking?
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 text-sm group">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                    How do I create an event?
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-2 text-sm group">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full group-hover:scale-125 transition-transform"></span>
                    Payment methods accepted?
                  </a>
                </li>
              </ul>
              <a 
                href="#" 
                className="mt-4 inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm group"
              >
                Visit Help Center
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaComments className="text-green-600" />
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="text-gray-900 font-semibold">9 AM - 6 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="text-gray-900 font-semibold">10 AM - 4 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">We're Online Now</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center text-white max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/20 px-5 py-2 rounded-full mb-5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold text-sm">Available 24/7</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Need Immediate Assistance?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Our support team is standing by to help you succeed
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button className="group px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all inline-flex items-center gap-2">
              <FaComments className="text-lg" />
              Start Live Chat
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <a 
              href="tel:+12345678900"
              className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold border-2 border-white/30 hover:border-white/50 hover:bg-white/20 hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <FaPhone className="text-lg" />
              Call Now
            </a>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-6 text-white/90 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              <span>Fast Response</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              <span>Expert Support</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              <span>No Wait Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaArrowLeft } from 'react-icons/fa';
import api from '../config/api';

const sectionIcons = ['📄', '👤', '🛡️', '💳', '📢', '🚫', '⭐', '©️', '⚖️', '🔒', '🔄', '🏛️', '📧'];

const TermsOfService = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/legal/terms')
      .then(({ data }) => setPage(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 sm:pt-28 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-8">
          <FaArrowLeft className="text-xs" /> Back to Home
        </Link>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <FaFileContract className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Terms of Service</h1>
            <p className="text-blue-200 text-sm">
              {loading ? 'Loading...' : `Last updated: ${page?.lastUpdated || ''}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-5/6" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {page?.intro && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
                <p className="text-gray-600 text-sm leading-relaxed">{page.intro}</p>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              {page?.sections?.map((section, i) => (
                <div key={i}>
                  {i > 0 && <div className="border-t border-gray-100 mb-8" />}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xl">{sectionIcons[i] || '📌'}</span>
                      <h2 className="text-base font-bold text-gray-900">{section.title}</h2>
                    </div>
                    <div className="pl-9 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-center gap-6">
          <Link to="/privacy-policy" className="text-sm text-purple-600 hover:underline">Privacy Policy</Link>
          <Link to="/contact" className="text-sm text-purple-600 hover:underline">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

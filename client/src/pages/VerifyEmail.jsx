import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { API_URL } from '../config/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(data.message);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-700 p-4">
      <div className="glass rounded-3xl p-8 md:p-12 max-w-md w-full text-center animate-fade-in">
        {status === 'verifying' && (
          <>
            <FaSpinner className="text-6xl text-white mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Verifying Email...</h1>
            <p className="text-white/80">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FaCheckCircle className="text-6xl text-green-400 mx-auto mb-6 animate-scale" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Email Verified!</h1>
            <p className="text-white/90 mb-6">{message}</p>
            <p className="text-white/80 mb-4">Redirecting to login...</p>
            <Link 
              to="/login" 
              className="inline-block bg-white text-[#5A43FF] px-8 py-3 rounded-xl font-semibold hover-lift"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <FaTimesCircle className="text-6xl text-red-400 mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Verification Failed</h1>
            <p className="text-white/90 mb-6">{message}</p>
            <div className="space-y-3">
              <Link 
                to="/login" 
                className="block bg-white text-[#5A43FF] px-8 py-3 rounded-xl font-semibold hover-lift"
              >
                Go to Login
              </Link>
              <Link 
                to="/register" 
                className="block bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover-lift border border-white/30"
              >
                Register Again
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

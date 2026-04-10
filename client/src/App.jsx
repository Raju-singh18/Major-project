import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import Suggestions from './pages/Suggestions';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import MyEvents from './pages/MyEvents';    
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import EditEvent from './pages/EditEvent';
import EventDashboard from './pages/EventDashboard';
import UserDashboard from './pages/UserDashboard';
import Contact from './pages/Contact';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Wishlists from './pages/Wishlists';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import OrganizerDashboard from './pages/OrganizerDashboard';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col relative">
          <ScrollToTop />
          <Navbar />
          <div className="flex-grow relative">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
            <Route path='/terms-of-services' element={<TermsOfService/>}/>
            <Route path="/organizer-dashboard" element={<PrivateRoute><OrganizerDashboard /></PrivateRoute>} />
            <Route path="/create-event" element={<PrivateRoute><CreateEvent /></PrivateRoute>} />
            <Route path="/my-events" element={<PrivateRoute><MyEvents /></PrivateRoute>} />
            <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/wishlists" element={<PrivateRoute><Wishlists/></PrivateRoute>}/>
            <Route path="/edit-event/:id" element={<PrivateRoute><EditEvent /></PrivateRoute>} />
            <Route path="/event-dashboard/:id" element={<PrivateRoute><EventDashboard /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

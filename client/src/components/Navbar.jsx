import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaUser, FaSignOutAlt, FaBell, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import api from '../config/api';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      const handleNotificationUpdate = () => fetchUnreadCount();
      window.addEventListener('notificationsUpdated', handleNotificationUpdate);
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationsUpdated', handleNotificationUpdate);
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications');
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children, mobile = false }) => (
    <Link
      to={to}
      onClick={() => mobile && setMobileMenuOpen(false)}
      className={`
        relative font-semibold text-sm
        ${isActive(to) ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}
        ${mobile ? 'block py-3 px-4 rounded-lg hover:bg-gray-50' : 'px-3 py-2'}
      `}
    >
      {children}
      {!mobile && (
        <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-purple-600 rounded-full transition-all duration-200 ${isActive(to) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
      )}
    </Link>
  );

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${visible ? 'top-0' : '-top-24'} bg-white border-b ${scrolled ? 'border-gray-200 shadow-sm' : 'border-gray-100'}`}>
      {/* Single clean bottom accent line matching home page purple */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 to-indigo-600"></div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FaCalendarAlt className="text-white text-base" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-gray-900 block leading-tight">EventMe</span>
              <span className="text-[10px] text-gray-500 font-medium leading-none">Discover Amazing Events</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-end ml-6">

            <NavLink to="/events">Events</NavLink>
            <NavLink to="/suggestions">Suggestions</NavLink>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className={`text-sm font-semibold px-3 py-1.5 rounded-lg ${isActive('/admin') ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
                      Admin
                    </Link>
                    <NavLink to="/create-event">Create</NavLink>
                    <NavLink to="/my-events">My Events</NavLink>
                    <NavLink to="/wishlists">Wishlists</NavLink>
                  </>
                )}

                {user.role === 'organizer' && (
                  <>
                    <NavLink to="/create-event">Create</NavLink>
                    <NavLink to="/my-events">My Events</NavLink>
                    <NavLink to="/my-bookings">Bookings</NavLink>
                    <NavLink to="/wishlists">Wishlists</NavLink>
                  </>
                )}

                {user.role === 'user' && (
                  <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/my-bookings">Bookings</NavLink>
                    <NavLink to="/wishlists">Wishlists</NavLink>
                  </>
                )}

                <NavLink to="/contact">Contact</NavLink>

                {/* Bell */}
                <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-gray-100 ml-1">
                  <FaBell className={`text-lg ${isActive('/notifications') ? 'text-purple-600' : 'text-gray-600'}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${
                      user.role === 'admin' ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                      : user.role === 'organizer' ? 'bg-gradient-to-br from-orange-500 to-red-500'
                      : 'bg-gradient-to-br from-purple-600 to-indigo-600'
                    }`}>
                      {user.avatar && !user.avatar.includes('placeholder') ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div className="hidden xl:block text-left">
                      <span className="text-sm font-semibold text-gray-900 block leading-tight">{user.name || user.email}</span>
                      <span className="text-xs text-gray-500 capitalize">{user.role}</span>
                    </div>
                    <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-[110]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-xs text-gray-500 mb-0.5">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-white text-xs font-semibold rounded-md ${
                          user.role === 'admin' ? 'bg-purple-600'
                          : user.role === 'organizer' ? 'bg-orange-500'
                          : 'bg-indigo-600'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : user.role === 'organizer' ? 'Organizer' : 'User'}
                        </span>
                      </div>

                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600">
                        <FaUser className="text-gray-400 text-xs" />
                        Profile
                      </Link>

                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600">
                          <FaUser className="text-gray-400 text-xs" />
                          Admin Panel
                        </Link>
                      )}

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                          <FaSignOutAlt className="text-xs" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/contact">Contact</NavLink>
                <Link to="/login" className="text-sm font-semibold text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:border-purple-500 hover:text-purple-600 ml-2">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-semibold px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 ml-1">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileMenuOpen
              ? <FaTimes className="text-xl text-gray-700" />
              : <FaBars className="text-xl text-gray-700" />
            }
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-0.5">
            <NavLink to="/events" mobile>Browse Events</NavLink>
            <NavLink to="/suggestions" mobile>Suggestions</NavLink>
            <NavLink to="/contact" mobile>Contact</NavLink>

            {user ? (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {user.role === 'admin' ? 'Admin Menu' : user.role === 'organizer' ? 'Organizer Menu' : 'My Account'}
                  </span>
                </div>

                {user.role === 'admin' && (
                  <>
                    <NavLink to="/admin" mobile>Admin Panel</NavLink>
                    <NavLink to="/create-event" mobile>Create Event</NavLink>
                    <NavLink to="/my-events" mobile>My Events</NavLink>
                    <NavLink to="/wishlists" mobile>Wishlists</NavLink>
                  </>
                )}
                {user.role === 'organizer' && (
                  <>
                    <NavLink to="/create-event" mobile>Create Event</NavLink>
                    <NavLink to="/my-events" mobile>My Events</NavLink>
                    <NavLink to="/my-bookings" mobile>My Bookings</NavLink>
                    <NavLink to="/wishlists" mobile>Wishlists</NavLink>
                  </>
                )}
                {user.role === 'user' && (
                  <>
                    <NavLink to="/dashboard" mobile>Dashboard</NavLink>
                    <NavLink to="/my-bookings" mobile>My Bookings</NavLink>
                    <NavLink to="/wishlists" mobile>Wishlists</NavLink>
                  </>
                )}

                <NavLink to="/notifications" mobile>
                  Notifications {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                </NavLink>
                <NavLink to="/profile" mobile>Profile</NavLink>

                <div className="pt-2 px-4">
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 py-2.5 text-sm text-red-600 font-semibold">
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 px-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-center text-sm font-bold text-purple-600 border border-purple-300 rounded-lg">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-center text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

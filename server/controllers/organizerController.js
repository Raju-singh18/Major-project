import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

export const getEventDashboard = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ event: req.params.eventId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const ticketsSold = event.totalSeats - event.availableSeats;

    const reviews = await Review.find({ event: req.params.eventId });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const ticketTypeStats = event.ticketTypes.map(tt => ({
      name: tt.name,
      price: tt.price,
      total: tt.quantity,
      sold: tt.sold,
      available: tt.quantity - tt.sold,
      revenue: tt.sold * tt.price
    }));

    res.json({
      event,
      stats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue,
        ticketsSold,
        availableSeats: event.availableSeats,
        avgRating: avgRating.toFixed(1),
        totalReviews: reviews.length
      },
      ticketTypeStats,
      recentBookings: bookings.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizerStats = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id });
    const eventIds = events.map(e => e._id);

    const totalEvents = events.length;
    const publishedEvents = events.filter(e => e.status === 'published').length;
    
    const bookings = await Booking.find({ event: { $in: eventIds } });
    const totalBookings = bookings.length;
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalTicketsSold = events.reduce((sum, e) => sum + (e.totalSeats - e.availableSeats), 0);

    const reviews = await Review.find({ event: { $in: eventIds } });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const upcomingEvents = events.filter(e => new Date(e.date) > new Date() && e.status === 'published');
    const pastEvents = events.filter(e => new Date(e.date) <= new Date());

    res.json({
      totalEvents,
      publishedEvents,
      upcomingEvents: upcomingEvents.length,
      pastEvents: pastEvents.length,
      totalBookings,
      totalRevenue,
      totalTicketsSold,
      avgRating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

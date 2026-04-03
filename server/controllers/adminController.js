import User from '../models/User.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { createNotification } from '../utils/notificationHelper.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: 'published' });
    const pendingEvents = await Event.countDocuments({ status: 'draft' });
    
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const recentBookings = await Booking.find()
      .populate('event', 'title')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const topEvents = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: '$event', bookings: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    const populatedTopEvents = await Event.populate(topEvents, { path: '_id', select: 'title date' });

    res.json({
      totalUsers,
      totalOrganizers,
      totalAdmins,
      totalEvents,
      publishedEvents,
      pendingEvents,
      totalBookings,
      confirmedBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings,
      recentUsers,
      topEvents: populatedTopEvents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllEvents = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'published';
    await event.save();

    await createNotification(
      event.organizer,
      'event_update',
      'Event Approved',
      `Your event "${event.title}" has been approved and is now published.`,
      event._id
    );

    res.json({ message: 'Event approved', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectEvent = async (req, res) => {
  try {
    const { reason } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'cancelled';
    await event.save();

    await createNotification(
      event.organizer,
      'event_update',
      'Event Rejected',
      `Your event "${event.title}" has been rejected. Reason: ${reason || 'No reason provided'}`,
      event._id
    );

    res.json({ message: 'Event rejected', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: 'organizer' })
      .select('-password')
      .populate('createdEvents');
    
    const organizersWithStats = await Promise.all(
      organizers.map(async (organizer) => {
        const events = await Event.find({ organizer: organizer._id });
        const eventIds = events.map(e => e._id);
        
        const bookings = await Booking.find({ event: { $in: eventIds } });
        const revenue = bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalAmount, 0);

        return {
          ...organizer.toObject(),
          stats: {
            totalEvents: events.length,
            publishedEvents: events.filter(e => e.status === 'published').length,
            totalBookings: bookings.length,
            totalRevenue: revenue
          }
        };
      })
    );

    res.json(organizersWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.suspended = true;
    await user.save();

    await createNotification(
      user._id,
      'event_update',
      'Account Suspended',
      'Your account has been suspended. Please contact support for more information.'
    );

    res.json({ message: 'User suspended', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.suspended = false;
    await user.save();

    await createNotification(
      user._id,
      'event_update',
      'Account Reactivated',
      'Your account has been reactivated. You can now access all features.'
    );

    res.json({ message: 'User unsuspended', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('event', 'title')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

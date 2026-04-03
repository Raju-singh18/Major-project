import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { createNotification } from '../utils/notificationHelper.js';

export const sendAnnouncement = async (req, res) => {
  try {
    const { eventId, title, message } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const bookings = await Booking.find({ 
      event: eventId, 
      status: 'confirmed' 
    }).distinct('user');

    const announcement = await Announcement.create({
      event: eventId,
      organizer: req.user._id,
      title,
      message,
      sentTo: bookings
    });

    for (const userId of bookings) {
      await createNotification(
        userId,
        'event_update',
        `Announcement: ${title}`,
        message,
        eventId
      );
    }

    res.status(201).json({
      message: `Announcement sent to ${bookings.length} attendees`,
      announcement
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ event: req.params.eventId })
      .populate('organizer', 'name')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (announcement.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await announcement.deleteOne();
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

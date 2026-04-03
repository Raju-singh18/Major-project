import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { createNotification } from '../utils/notificationHelper.js';

const generateBookingReference = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Mock payment for development (when Razorpay credentials are not available)
export const createMockBooking = async (req, res) => {
  try {
    // Check if user is suspended
    const user = await User.findById(req.user._id);
    if (user.suspended) {
      return res.status(403).json({ 
        message: 'Your account has been suspended. You cannot book events.' 
      });
    }

    const { eventId, tickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let totalAmount = 0;
    let totalTickets = 0;

    for (const ticket of tickets) {
      const ticketType = event.ticketTypes.find(t => t.name === ticket.ticketType);
      if (!ticketType) {
        return res.status(400).json({ message: `Ticket type ${ticket.ticketType} not found` });
      }
      if (ticketType.quantity - ticketType.sold < ticket.quantity) {
        return res.status(400).json({ message: `Not enough ${ticket.ticketType} tickets available` });
      }
      totalAmount += ticketType.price * ticket.quantity;
      totalTickets += ticket.quantity;
    }

    if (event.availableSeats < totalTickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      tickets,
      totalAmount,
      bookingReference: generateBookingReference(),
      paymentStatus: 'completed',
      paymentId: 'MOCK_' + Date.now(),
      orderId: 'MOCK_ORDER_' + Date.now()
    });

    for (const ticket of tickets) {
      const ticketTypeIndex = event.ticketTypes.findIndex(t => t.name === ticket.ticketType);
      event.ticketTypes[ticketTypeIndex].sold += ticket.quantity;
    }
    event.availableSeats -= totalTickets;
    await event.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { bookedEvents: booking._id }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event')
      .populate('user', 'name email');

    await createNotification(
      req.user._id,
      'booking',
      'Booking Confirmed (Mock Payment)',
      `Your booking for ${event.title} has been confirmed. Reference: ${booking.bookingReference}`,
      eventId,
      booking._id
    );

    res.status(201).json({
      success: true,
      booking: populatedBooking,
      message: 'Mock payment successful (Development mode)'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

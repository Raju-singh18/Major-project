import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { createNotification } from '../utils/notificationHelper.js';
import { instance } from '../config/razorpay.js';
import { sendEmail } from '../utils/sendEmail.js';
import { bookingConfirmedEmailTemplate, bookingCancelledEmailTemplate } from '../utils/emailTemplates.js';
import crypto from 'crypto';

const generateBookingReference = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Create Razorpay order
export const createOrder = async (req, res) => {
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

    // Validate tickets and calculate total
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

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // amount in paise
      currency: "INR",
      receipt: generateBookingReference(),
      notes: {
        eventId: eventId,
        userId: req.user._id.toString(),
        tickets: JSON.stringify(tickets)
      }
    };

    console.log('Creating Razorpay order with options:', {
      ...options,
      amount: options.amount,
      currency: options.currency
    });
    console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY ? 'Present' : 'Missing');
    console.log('Razorpay Secret:', process.env.RAZORPAY_SECRET ? 'Present' : 'Missing');

    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
      throw new Error('Razorpay credentials are not configured properly');
    }

    const order = await instance.orders.create(options);
    
    console.log('Razorpay order created successfully:', order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY
    });
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Error details:', {
      message: error.message,
      description: error.error?.description,
      code: error.error?.code,
      source: error.error?.source,
      step: error.error?.step,
      reason: error.error?.reason
    });
    res.status(500).json({ 
      message: error.message || 'Failed to create payment order',
      error: error.error || error
    });
  }
};

// Verify payment and create booking
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      eventId,
      tickets 
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Payment verified, create booking
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    let totalAmount = 0;
    let totalTickets = 0;

    for (const ticket of tickets) {
      const ticketType = event.ticketTypes.find(t => t.name === ticket.ticketType);
      totalAmount += ticketType.price * ticket.quantity;
      totalTickets += ticket.quantity;
    }

    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      tickets,
      totalAmount,
      bookingReference: generateBookingReference(),
      paymentStatus: 'completed',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    // Update event ticket counts
    for (const ticket of tickets) {
      const ticketTypeIndex = event.ticketTypes.findIndex(t => t.name === ticket.ticketType);
      event.ticketTypes[ticketTypeIndex].sold += ticket.quantity;
    }
    event.availableSeats -= totalTickets;
    await event.save();

    // Update user's booked events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { bookedEvents: booking._id }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('event')
      .populate('user', 'name email');

    // Create notification
    await createNotification(
      req.user._id,
      'booking',
      'Booking Confirmed',
      `Your booking for ${event.title} has been confirmed. Reference: ${booking.bookingReference}`,
      eventId,
      booking._id
    );

    // Send confirmation email (non-blocking)
    sendEmail({
      email: populatedBooking.user.email,
      subject: `Booking Confirmed – ${event.title} | Ref: ${booking.bookingReference}`,
      html: bookingConfirmedEmailTemplate(populatedBooking.user, event, booking)
    }).catch(err => console.error('Booking confirmation email error:', err));

    res.status(201).json({
      success: true,
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
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
      bookingReference: generateBookingReference()
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
      'Booking Confirmed',
      `Your booking for ${event.title} has been confirmed. Reference: ${booking.bookingReference}`,
      eventId,
      booking._id
    );

    // Send confirmation email (non-blocking)
    sendEmail({
      email: populatedBooking.user.email,
      subject: `Booking Confirmed – ${event.title} | Ref: ${booking.bookingReference}`,
      html: bookingConfirmedEmailTemplate(populatedBooking.user, event, booking)
    }).catch(err => console.error('Booking confirmation email error:', err));

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: {
          path: 'reviews.user',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    // Filter out bookings where event was deleted
    const validBookings = bookings.filter(booking => booking.event !== null);
    
    res.json(validBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    const event = await Event.findById(booking.event);
    let totalTickets = 0;
    for (const ticket of booking.tickets) {
      const ticketTypeIndex = event.ticketTypes.findIndex(t => t.name === ticket.ticketType);
      event.ticketTypes[ticketTypeIndex].sold -= ticket.quantity;
      totalTickets += ticket.quantity;
    }
    event.availableSeats += totalTickets;
    await event.save();

    await createNotification(
      req.user._id,
      'cancellation',
      'Booking Cancelled',
      `Your booking for ${event.title} has been cancelled. Reference: ${booking.bookingReference}`,
      booking.event,
      booking._id
    );

    // Send cancellation email (non-blocking)
    const cancelUser = await User.findById(req.user._id).select('name email');
    sendEmail({
      email: cancelUser.email,
      subject: `Booking Cancelled – ${event.title} | Ref: ${booking.bookingReference}`,
      html: bookingCancelledEmailTemplate(cancelUser, event, booking)
    }).catch(err => console.error('Cancellation email error:', err));

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('event', 'title date')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

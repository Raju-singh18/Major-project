import Review from '../models/Review.js';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { createNotification } from '../utils/notificationHelper.js';

export const createReview = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body;

    const hasBooking = await Booking.findOne({
      event: eventId,
      user: req.user._id,
      status: 'confirmed'
    });

    if (!hasBooking) {
      return res.status(403).json({ message: 'You can only review events you have attended' });
    }

    const existingReview = await Review.findOne({
      event: eventId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this event' });
    }

    const review = await Review.create({
      event: eventId,
      user: req.user._id,
      rating,
      comment
    });

    const event = await Event.findById(eventId);
    await createNotification(
      event.organizer,
      'review',
      'New Review',
      `${req.user.name} left a ${rating}-star review on ${event.title}`,
      eventId
    );

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      avgRating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    const updatedReview = await review.save();
    const populatedReview = await Review.findById(updatedReview._id)
      .populate('user', 'name avatar');

    res.json(populatedReview);
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

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

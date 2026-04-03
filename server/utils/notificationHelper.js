import Notification from '../models/Notification.js';

export const createNotification = async (userId, type, title, message, relatedEvent = null, relatedBooking = null) => {
  try {
    await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedEvent,
      relatedBooking
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

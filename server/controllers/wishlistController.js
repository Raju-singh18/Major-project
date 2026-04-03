import User from '../models/User.js';
import Event from '../models/Event.js';
import { createNotification } from '../utils/notificationHelper.js';

// Add event to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already in wishlist
    const user = await User.findById(userId);
    if (user.wishlist.includes(eventId)) {
      return res.status(400).json({ message: 'Event already in wishlist' });
    }

    // Add to wishlist
    user.wishlist.push(eventId);
    await user.save();

    // Create notification
    await createNotification(
      userId,
      'wishlist',
      'Added to Wishlist',
      `${event.title} has been added to your wishlist`,
      eventId
    );

    res.json({ 
      message: 'Event added to wishlist',
      wishlist: user.wishlist 
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// Remove event from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);
    
    // Check if event is in wishlist
    if (!user.wishlist.includes(eventId)) {
      return res.status(400).json({ message: 'Event not in wishlist' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== eventId);
    await user.save();

    res.json({ 
      message: 'Event removed from wishlist',
      wishlist: user.wishlist 
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// Toggle wishlist (add if not present, remove if present)
export const toggleWishlist = async (req, res) => {
  try {
    console.log('Toggle wishlist request received');
    console.log('Body:', req.body);
    console.log('User:', req.user?._id);

    const { eventId } = req.body;
    const userId = req.user._id;

    if (!eventId) {
      console.error('No eventId provided');
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      console.error('Event not found:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('Event found:', event.title);

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user.name);
    console.log('Current wishlist:', user.wishlist);

    const isInWishlist = user.wishlist.some(id => id.toString() === eventId.toString());
    console.log('Is in wishlist:', isInWishlist);

    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== eventId.toString());
      await user.save();
      
      console.log('Removed from wishlist. New wishlist:', user.wishlist);
      
      res.json({ 
        message: 'Event removed from wishlist',
        isInWishlist: false,
        wishlist: user.wishlist 
      });
    } else {
      // Add to wishlist
      user.wishlist.push(eventId);
      await user.save();

      console.log('Added to wishlist. New wishlist:', user.wishlist);

      // Create notification
      try {
        await createNotification(
          userId,
          'wishlist',
          'Added to Wishlist',
          `${event.title} has been added to your wishlist`,
          eventId
        );
      } catch (notifError) {
        console.error('Error creating notification:', notifError);
        // Don't fail the request if notification fails
      }

      res.json({ 
        message: 'Event added to wishlist',
        isInWishlist: true,
        wishlist: user.wishlist 
      });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate({
      path: 'wishlist',
      match: { date: { $gte: new Date() } }, // Only future events
      options: { sort: { date: 1 } }
    });

    // Filter out null values (deleted events)
    const validWishlist = user.wishlist.filter(event => event !== null);

    res.json(validWishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check if event is in wishlist
export const checkWishlist = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    console.log('Checking wishlist for event:', eventId, 'user:', userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isInWishlist = user.wishlist.some(id => id.toString() === eventId.toString());
    console.log('Is in wishlist:', isInWishlist);

    res.json({ isInWishlist });
  } catch (error) {
    console.error('Error checking wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { wishlist: [] });

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    res.status(500).json({ message: error.message });
  }
};

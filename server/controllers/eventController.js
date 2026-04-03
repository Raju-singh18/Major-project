import Event from '../models/Event.js';
import User from '../models/User.js';

export const getEvents = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      status, 
      featured, 
      limit, 
      sortBy,
      minPrice,
      maxPrice,
      city,
      upcoming
    } = req.query;
    
    let query = {};

    // Category filter
    if (category) query.category = category;
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.venue': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status) query.status = status;
    else query.status = 'published';
    
    // Featured filter
    if (featured === 'true') query.featured = true;
    
    // City filter
    if (city) query['location.city'] = { $regex: city, $options: 'i' };

    // Only show future events by default
    if (upcoming !== 'false') {
      query.date = { $gte: new Date() };
    }

    // Build the query
    let eventsQuery = Event.find(query)
      .populate('organizer', 'name email avatar');

    // Sorting
    switch (sortBy) {
      case 'date':
        eventsQuery = eventsQuery.sort({ date: 1 });
        break;
      case 'price-low':
        eventsQuery = eventsQuery.sort({ 'ticketTypes.0.price': 1 });
        break;
      case 'price-high':
        eventsQuery = eventsQuery.sort({ 'ticketTypes.0.price': -1 });
        break;
      case 'popular':
        // Sort by tickets sold (totalSeats - availableSeats)
        eventsQuery = eventsQuery.sort({ availableSeats: 1 });
        break;
      case 'trending':
        // Sort by recently created and popular
        eventsQuery = eventsQuery.sort({ createdAt: -1, availableSeats: 1 });
        break;
      case 'featured':
        eventsQuery = eventsQuery.sort({ featured: -1, date: 1 });
        break;
      default:
        eventsQuery = eventsQuery.sort({ date: 1 });
    }

    // Limit results
    if (limit) eventsQuery = eventsQuery.limit(parseInt(limit));

    const events = await eventsQuery;

    // Filter by price range if specified
    let filteredEvents = events;
    if (minPrice || maxPrice) {
      filteredEvents = events.filter(event => {
        const eventMinPrice = event.ticketTypes?.length 
          ? Math.min(...event.ticketTypes.map(t => t.price)) 
          : 0;
        
        if (minPrice && eventMinPrice < parseFloat(minPrice)) return false;
        if (maxPrice && eventMinPrice > parseFloat(maxPrice)) return false;
        return true;
      });
    }

    // Add computed fields
    const enrichedEvents = filteredEvents.map(event => {
      const eventObj = event.toObject();
      const minPrice = eventObj.ticketTypes?.length 
        ? Math.min(...eventObj.ticketTypes.map(t => t.price)) 
        : 0;
      const maxPrice = eventObj.ticketTypes?.length 
        ? Math.max(...eventObj.ticketTypes.map(t => t.price)) 
        : 0;
      const soldTickets = eventObj.totalSeats - eventObj.availableSeats;
      const soldPercentage = eventObj.totalSeats > 0 
        ? Math.round((soldTickets / eventObj.totalSeats) * 100) 
        : 0;

      return {
        ...eventObj,
        minPrice,
        maxPrice,
        soldTickets,
        soldPercentage,
        isAlmostSoldOut: soldPercentage >= 80,
        isSoldOut: eventObj.availableSeats === 0
      };
    });

    res.json(enrichedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email avatar');

    if (event) {
      // Get related events (same category, exclude current event)
      const relatedEvents = await Event.find({
        category: event.category,
        _id: { $ne: event._id },
        status: 'published',
        date: { $gte: new Date() }
      })
      .limit(3)
      .populate('organizer', 'name email');

      res.json({ ...event.toObject(), relatedEvents });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    // Check if user is suspended
    const user = await User.findById(req.user._id);
    if (user.suspended) {
      return res.status(403).json({ 
        message: 'Your account has been suspended. You cannot create events.' 
      });
    }

    // Check if user has permission to create events (only organizers and admins)
    if (user.role === 'user') {
      return res.status(403).json({ 
        message: 'Only organizers and admins can create events. Users can only book events.' 
      });
    }

    const {
      title, description, category, date, time,
      location, image, ticketTypes, totalSeats
    } = req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      image,
      organizer: req.user._id,
      ticketTypes,
      totalSeats,
      availableSeats: totalSeats
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdEvents: event._id }
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    Object.assign(event, req.body);
    const updatedEvent = await event.save();

    res.json(updatedEvent);
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

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get event statistics
export const getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments({ status: 'published' });
    const upcomingEvents = await Event.countDocuments({ 
      status: 'published',
      date: { $gte: new Date() }
    });
    const featuredEvents = await Event.countDocuments({ 
      status: 'published',
      featured: true 
    });
    
    // Get events by category
    const eventsByCategory = await Event.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get popular cities
    const popularCities = await Event.aggregate([
      { $match: { status: 'published', date: { $gte: new Date() } } },
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Calculate total tickets sold
    const ticketStats = await Event.aggregate([
      { $match: { status: 'published' } },
      {
        $project: {
          soldTickets: { $subtract: ['$totalSeats', '$availableSeats'] },
          totalSeats: 1
        }
      },
      {
        $group: {
          _id: null,
          totalSold: { $sum: '$soldTickets' },
          totalCapacity: { $sum: '$totalSeats' }
        }
      }
    ]);

    res.json({
      totalEvents,
      upcomingEvents,
      featuredEvents,
      eventsByCategory,
      popularCities,
      ticketStats: ticketStats[0] || { totalSold: 0, totalCapacity: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending events
export const getTrendingEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Get events that are selling fast (high sold percentage)
    const events = await Event.find({
      status: 'published',
      date: { $gte: new Date() },
      availableSeats: { $gt: 0 }
    })
    .populate('organizer', 'name email avatar')
    .sort({ availableSeats: 1, createdAt: -1 })
    .limit(limit);

    const enrichedEvents = events.map(event => {
      const eventObj = event.toObject();
      const soldTickets = eventObj.totalSeats - eventObj.availableSeats;
      const soldPercentage = Math.round((soldTickets / eventObj.totalSeats) * 100);
      const minPrice = eventObj.ticketTypes?.length 
        ? Math.min(...eventObj.ticketTypes.map(t => t.price)) 
        : 0;

      return {
        ...eventObj,
        minPrice,
        soldTickets,
        soldPercentage,
        trending: soldPercentage >= 60
      };
    });

    res.json(enrichedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

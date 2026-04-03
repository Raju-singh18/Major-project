import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Music', 'Sports', 'Conference', 'Workshop', 'Festival', 'Theater', 'Other']
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: {
    venue: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true }
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/600x400'
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketTypes: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },

  // ✅ ADD THIS
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],

  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;

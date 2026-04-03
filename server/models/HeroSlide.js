import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema({
  tag: { type: String, required: true, trim: true },
  heading: { type: String, required: true, trim: true },
  highlight: { type: String, required: true, trim: true },
  sub: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('HeroSlide', heroSlideSchema);

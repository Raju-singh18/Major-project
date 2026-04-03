import HeroSlide from '../models/HeroSlide.js';

// Public — get all active slides ordered
export const getSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — get all slides (including inactive)
export const getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — create slide
export const createSlide = async (req, res) => {
  try {
    const { tag, heading, highlight, sub, image, order, active } = req.body;
    const slide = await HeroSlide.create({ tag, heading, highlight, sub, image, order: order || 0, active: active !== false });
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — update slide
export const updateSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    Object.assign(slide, req.body);
    const updated = await slide.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin — delete slide
export const deleteSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    await slide.deleteOne();
    res.json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

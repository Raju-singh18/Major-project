import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const legalPageSchema = new mongoose.Schema({
  type: { type: String, enum: ['privacy', 'terms'], required: true, unique: true },
  lastUpdated: { type: String, default: () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
  intro: { type: String, default: '' },
  sections: [sectionSchema],
}, { timestamps: true });

export default mongoose.model('LegalPage', legalPageSchema);

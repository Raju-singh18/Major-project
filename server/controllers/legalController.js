import LegalPage from '../models/LegalPage.js';

// Default content so pages work even before admin sets anything
const defaults = {
  privacy: {
    intro: 'EventMe ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.',
    sections: [
      { title: '1. Information We Collect', content: 'Account Information: When you register, we collect your name, email address, password, and role.\nProfile Information: Phone number, bio, and profile photo you optionally provide.\nBooking Information: Ticket purchases, booking references, and payment transaction IDs.\nUsage Data: Pages visited, events viewed, and interactions with the platform.' },
      { title: '2. How We Use Your Information', content: '• To create and manage your account\n• To process ticket bookings and send confirmation emails\n• To send event announcements from organizers you\'ve booked with\n• To improve platform features and user experience\n• To respond to your support requests' },
      { title: '3. Information Sharing', content: 'We do not sell your personal information. We share data only with event organizers (for bookings), payment processors (Razorpay), and cloud services (Cloudinary, MongoDB Atlas).' },
      { title: '4. Data Security', content: '• Passwords are hashed using bcrypt\n• All data transmission is encrypted via HTTPS/SSL\n• JWT tokens are used for authentication\n• Payment processing is handled by Razorpay (PCI DSS compliant)' },
      { title: '5. Your Rights', content: '• Access and update your profile at any time\n• Delete your account from Profile → Danger Zone\n• Request a copy of your data by contacting support\n• Opt out of non-essential communications' },
      { title: '6. Contact Us', content: 'For privacy-related questions, contact us at support@eventme.com or use our Contact page.' },
    ],
  },
  terms: {
    intro: 'By accessing or using EventMe, you agree to be bound by these Terms of Service. Please read them carefully before using the platform.',
    sections: [
      { title: '1. Acceptance of Terms', content: 'By creating an account or using any part of EventMe, you confirm that you are at least 13 years old and agree to these Terms.' },
      { title: '2. User Accounts', content: '• You are responsible for maintaining the confidentiality of your account credentials.\n• You must provide accurate and complete information during registration.\n• You are responsible for all activity that occurs under your account.' },
      { title: '3. Booking & Payments', content: '• All ticket purchases are final unless the event is cancelled by the organizer.\n• Payments are processed securely by Razorpay.\n• International cards are not supported at this time.' },
      { title: '4. Prohibited Conduct', content: '• Use the platform for any unlawful purpose\n• Post false, misleading, or fraudulent event information\n• Harass, abuse, or harm other users\n• Attempt to gain unauthorized access to any part of the platform' },
      { title: '5. Limitation of Liability', content: 'EventMe is a platform connecting event organizers and attendees. We are not responsible for the quality, safety, or legality of events listed on the platform.' },
      { title: '6. Contact', content: 'For questions about these Terms, contact us at support@eventme.com or use our Contact page.' },
    ],
  },
};

export const getLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['privacy', 'terms'].includes(type)) return res.status(400).json({ message: 'Invalid type' });

    let page = await LegalPage.findOne({ type });
    if (!page) {
      // Return defaults without saving — admin must explicitly save
      return res.json({ type, ...defaults[type], lastUpdated: 'January 1, 2025' });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const upsertLegalPage = async (req, res) => {
  try {
    const { type } = req.params;
    if (!['privacy', 'terms'].includes(type)) return res.status(400).json({ message: 'Invalid type' });

    const { intro, sections, lastUpdated } = req.body;

    const page = await LegalPage.findOneAndUpdate(
      { type },
      {
        type,
        intro,
        sections,
        lastUpdated: lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      },
      { upsert: true, new: true }
    );

    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

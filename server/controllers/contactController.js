import Contact from '../models/Contact.js';
import { sendEmail } from '../utils/sendEmail.js';
import { contactSubmissionEmailTemplate, contactConfirmationEmailTemplate } from '../utils/emailTemplates.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // Create contact submission
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      userId: req.user ? req.user._id : null
    });

    // Send confirmation email to user
    try {
      await sendEmail({
        email: email,
        subject: 'We received your message - EventMe',
        html: contactConfirmationEmailTemplate(name, subject)
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    // Send notification email to admin
    try {
      if (process.env.ADMIN_EMAIL) {
        await sendEmail({
          email: process.env.ADMIN_EMAIL,
          subject: `New Contact Form Submission - ${subject}`,
          html: contactSubmissionEmailTemplate(name, email, subject, message)
        });
      }
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you within 24 hours.',
      contact: {
        _id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact form. Please try again.' });
  }
};

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res) => {
  try {
    const { status, subject } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (subject) query.subject = subject;

    const contacts = await Contact.find(query)
      .populate('userId', 'name email')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    res.json({
      success: true,
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ message: 'Failed to fetch contact' });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['new', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    contact.status = status;
    await contact.save();

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Failed to update contact status' });
  }
};

// @desc    Respond to contact submission
// @route   POST /api/contact/:id/respond
// @access  Private/Admin
export const respondToContact = async (req, res) => {
  try {
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ message: 'Response message is required' });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    contact.response = response;
    contact.respondedAt = Date.now();
    contact.respondedBy = req.user._id;
    contact.status = 'resolved';
    await contact.save();

    // Send response email to user
    try {
      await sendEmail({
        email: contact.email,
        subject: `Re: ${contact.subject} - EventMe Support`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">EventMe Support Response</h2>
            <p>Hi ${contact.name},</p>
            <p>Thank you for contacting us. Here's our response to your inquiry:</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; white-space: pre-wrap;">${response}</p>
            </div>
            <p>If you have any further questions, please don't hesitate to reach out.</p>
            <p>Best regards,<br>EventMe Support Team</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error sending response email:', emailError);
    }

    res.json({
      success: true,
      message: 'Response sent successfully',
      contact
    });
  } catch (error) {
    console.error('Respond to contact error:', error);
    res.status(500).json({ message: 'Failed to send response' });
  }
};

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
};

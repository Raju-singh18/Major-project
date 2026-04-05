export const verificationEmailTemplate = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #F7F7FF;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #5A43FF 0%, #FF8F00 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          padding: 30px;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #5A43FF 0%, #8B7FFF 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to EventMe!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for registering with EventMe! We're excited to have you join our community.</p>
          <p>To complete your registration and start booking amazing events, please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #5A43FF;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account with EventMe, please ignore this email.</p>
          <p>Best regards,<br>The EventMe Team</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const welcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #F7F7FF;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #5A43FF 0%, #FF8F00 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          padding: 30px;
        }
        .feature {
          margin: 20px 0;
          padding: 15px;
          background-color: #F7F7FF;
          border-radius: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎊 Email Verified Successfully!</h1>
        </div>
        <div class="content">
          <h2>Welcome aboard, ${name}!</h2>
          <p>Your email has been verified successfully. You can now enjoy all the features of EventMe:</p>
          
          <div class="feature">
            <h3>🎫 Browse & Book Events</h3>
            <p>Discover amazing events and book tickets instantly</p>
          </div>
          
          <div class="feature">
            <h3>📅 Manage Bookings</h3>
            <p>View and manage all your event bookings in one place</p>
          </div>
          
          <div class="feature">
            <h3>⭐ Leave Reviews</h3>
            <p>Share your experience and help others discover great events</p>
          </div>
          
          <p>Ready to get started? <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/events" style="color: #5A43FF;">Browse Events Now</a></p>
          
          <p>Best regards,<br>The EventMe Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const resetPasswordEmailTemplate = (name, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #F7F7FF;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #5A43FF 0%, #FF8F00 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          padding: 30px;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          background: linear-gradient(135deg, #5A43FF 0%, #8B7FFF 100%);
          color: white;
          text-decoration: none;
          border-radius: 10px;
          margin: 20px 0;
          font-weight: bold;
        }
        .warning {
          background-color: #FFF3CD;
          border-left: 4px solid #FF8F00;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password for your EventMe account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #5A43FF;">${resetUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Important:</strong>
            <ul>
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request a password reset, please ignore this email</li>
              <li>Your password will remain unchanged</li>
            </ul>
          </div>
          
          <p>Best regards,<br>The EventMe Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const bookingConfirmationEmailTemplate = (name, event, booking) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #F7F7FF;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #5A43FF 0%, #FF8F00 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          padding: 30px;
        }
        .booking-details {
          background-color: #F7F7FF;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Your booking has been confirmed! We're excited to see you at the event.</p>
          
          <div class="booking-details">
            <h3>📋 Booking Details</h3>
            <div class="detail-row">
              <strong>Booking Reference:</strong>
              <span>${booking.bookingReference}</span>
            </div>
            <div class="detail-row">
              <strong>Event:</strong>
              <span>${event.title}</span>
            </div>
            <div class="detail-row">
              <strong>Date:</strong>
              <span>${new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div class="detail-row">
              <strong>Time:</strong>
              <span>${event.time}</span>
            </div>
            <div class="detail-row">
              <strong>Venue:</strong>
              <span>${event.location.venue}</span>
            </div>
            <div class="detail-row">
              <strong>Total Amount:</strong>
              <span style="color: #5A43FF; font-weight: bold;">$${booking.totalAmount}</span>
            </div>
          </div>
          
          <p><strong>Important:</strong> Please save this email for your records. You may need to show your booking reference at the venue.</p>
          
          <p>View your booking details: <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-bookings" style="color: #5A43FF;">My Bookings</a></p>
          
          <p>Best regards,<br>The EventMe Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const contactConfirmationEmailTemplate = (name, subject) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #F7F7FF;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #5A43FF 0%, #FF8F00 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          padding: 30px;
        }
        .info-box {
          background-color: #E0F2FE;
          border-left: 4px solid #0EA5E9;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ Message Received!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for contacting EventMe! We've received your message and our support team will review it shortly.</p>
          
          <div class="info-box">
            <strong>📋 Your Inquiry:</strong>
            <p style="margin: 10px 0 0 0;">${subject}</p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our support team will review your message</li>
            <li>You'll receive a response within 24 hours</li>
            <li>Check your email for our reply</li>
          </ul>
          
          <p>In the meantime, you might find answers in our <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/contact" style="color: #5A43FF;">Help Center</a>.</p>
          
          <p>Best regards,<br>The EventMe Support Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const contactSubmissionEmailTemplate = (name, email, subject, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #F7F7FF;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          padding: 30px;
        }
        .detail-box {
          background-color: #F3F4F6;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        .message-box {
          background-color: #FEF3C7;
          border-left: 4px solid #F59E0B;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Contact Form Submission</h1>
        </div>
        <div class="content">
          <h2>New Message from Contact Form</h2>
          <p>A new contact form submission has been received on EventMe.</p>
          
          <div class="detail-box">
            <p><strong>👤 Name:</strong> ${name}</p>
            <p><strong>✉️ Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>📋 Subject:</strong> ${subject}</p>
            <p><strong>📅 Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="message-box">
            <strong>💬 Message:</strong><br><br>
            ${message}
          </div>
          
          <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/contacts" 
               style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #5A43FF 0%, #8B7FFF 100%); color: white; text-decoration: none; border-radius: 10px; font-weight: bold;">
              View in Admin Panel
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const BASE_STYLES = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #F7F7FF; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  .header { padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: white; }
  .content { padding: 30px; }
  .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee; }
  .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .btn { display: inline-block; padding: 14px 28px; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
`;

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

// ── Booking Confirmation ──────────────────────────────────────────────────────
export const bookingConfirmedEmailTemplate = (user, event, booking) => `
<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #4f46e5);">
    <h1>🎉 Booking Confirmed!</h1>
    <p style="margin:0;opacity:0.9;">Your tickets are secured</p>
  </div>
  <div class="content">
    <h2>Hi ${user.name},</h2>
    <p>Great news! Your booking for <strong>${event.title}</strong> is confirmed. See you there!</p>

    <div style="background:#f5f3ff;border-radius:10px;padding:20px;margin:20px 0;">
      <h3 style="margin-top:0;color:#7c3aed;">📋 Booking Details</h3>
      <div class="detail-row"><span>Booking Reference</span><strong style="color:#7c3aed;">${booking.bookingReference}</strong></div>
      <div class="detail-row"><span>Event</span><span>${event.title}</span></div>
      <div class="detail-row"><span>Date</span><span>${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
      <div class="detail-row"><span>Time</span><span>${event.time}</span></div>
      <div class="detail-row"><span>Venue</span><span>${event.location.venue}, ${event.location.city}</span></div>
      <div class="detail-row"><span>Tickets</span><span>${booking.tickets.map(t => `${t.quantity}× ${t.ticketType}`).join(', ')}</span></div>
      <div class="detail-row"><span>Total Paid</span><strong style="color:#7c3aed;">$${booking.totalAmount}</strong></div>
    </div>

    <p style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:4px;">
      💡 <strong>Tip:</strong> Save this email — you may need to show your booking reference at the venue.
    </p>

    <div style="text-align:center;">
      <a href="${FRONTEND}/my-bookings" class="btn" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">View My Bookings</a>
    </div>
    <p>See you at the event!<br>The EventMe Team</p>
  </div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p></div>
</div>
</body></html>`;

// ── Booking Cancellation ──────────────────────────────────────────────────────
export const bookingCancelledEmailTemplate = (user, event, booking) => `
<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #dc2626, #ef4444);">
    <h1>❌ Booking Cancelled</h1>
  </div>
  <div class="content">
    <h2>Hi ${user.name},</h2>
    <p>Your booking has been cancelled as requested. Here's a summary:</p>

    <div style="background:#fef2f2;border-radius:10px;padding:20px;margin:20px 0;">
      <div class="detail-row"><span>Booking Reference</span><strong>${booking.bookingReference}</strong></div>
      <div class="detail-row"><span>Event</span><span>${event.title}</span></div>
      <div class="detail-row"><span>Date</span><span>${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
      <div class="detail-row"><span>Tickets</span><span>${booking.tickets.map(t => `${t.quantity}× ${t.ticketType}`).join(', ')}</span></div>
      <div class="detail-row"><span>Amount</span><span>$${booking.totalAmount}</span></div>
    </div>

    <p>If you have any questions about refunds, please contact our support team.</p>
    <div style="text-align:center;">
      <a href="${FRONTEND}/events" class="btn" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">Browse Other Events</a>
    </div>
    <p>The EventMe Team</p>
  </div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p></div>
</div>
</body></html>`;

// ── Announcement to Attendees ─────────────────────────────────────────────────
export const announcementEmailTemplate = (attendeeName, event, title, message) => `
<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #059669, #10b981);">
    <h1>📢 Event Announcement</h1>
    <p style="margin:0;opacity:0.9;">${event.title}</p>
  </div>
  <div class="content">
    <h2>Hi ${attendeeName},</h2>
    <p>The organizer of <strong>${event.title}</strong> has sent you an update:</p>

    <div style="background:#f0fdf4;border-left:4px solid #10b981;border-radius:4px;padding:20px;margin:20px 0;">
      <h3 style="margin-top:0;color:#059669;">${title}</h3>
      <p style="margin-bottom:0;white-space:pre-line;">${message}</p>
    </div>

    <div style="background:#f9fafb;border-radius:8px;padding:16px;margin:16px 0;font-size:14px;">
      <p style="margin:0;"><strong>📅 Event:</strong> ${event.title}</p>
      <p style="margin:6px 0 0;"><strong>🗓 Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      <p style="margin:6px 0 0;"><strong>📍 Venue:</strong> ${event.location.venue}, ${event.location.city}</p>
    </div>

    <div style="text-align:center;">
      <a href="${FRONTEND}/events/${event._id}" class="btn" style="background:linear-gradient(135deg,#059669,#10b981);">View Event Details</a>
    </div>
    <p>The EventMe Team</p>
  </div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p></div>
</div>
</body></html>`;

// ── Account Suspended ─────────────────────────────────────────────────────────
export const accountSuspendedEmailTemplate = (name) => `
<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #dc2626, #b91c1c);">
    <h1>🚫 Account Suspended</h1>
  </div>
  <div class="content">
    <h2>Hi ${name},</h2>
    <p>Your EventMe account has been temporarily suspended by our admin team.</p>
    <p>While suspended, you will not be able to:</p>
    <ul>
      <li>Book event tickets</li>
      <li>Create or manage events</li>
      <li>Leave reviews</li>
    </ul>
    <p>If you believe this is a mistake or would like to appeal, please contact our support team.</p>
    <div style="text-align:center;">
      <a href="${FRONTEND}/contact" class="btn" style="background:linear-gradient(135deg,#dc2626,#b91c1c);">Contact Support</a>
    </div>
    <p>The EventMe Team</p>
  </div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p></div>
</div>
</body></html>`;

// ── Account Reactivated ───────────────────────────────────────────────────────
export const accountReactivatedEmailTemplate = (name) => `
<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #059669, #10b981);">
    <h1>✅ Account Reactivated</h1>
  </div>
  <div class="content">
    <h2>Hi ${name},</h2>
    <p>Great news! Your EventMe account has been reactivated. You now have full access to all features.</p>
    <div style="text-align:center;">
      <a href="${FRONTEND}/events" class="btn" style="background:linear-gradient(135deg,#059669,#10b981);">Browse Events</a>
    </div>
    <p>Welcome back!<br>The EventMe Team</p>
  </div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p></div>
</div>
</body></html>`;

// ── Event Approved (to organizer) ─────────────────────────────────────────────
export const eventApprovedEmailTemplate = (organizerName, event) => `
<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #7c3aed, #4f46e5);">
    <h1>🎉 Event Approved!</h1>
  </div>
  <div class="content">
    <h2>Hi ${organizerName},</h2>
    <p>Your event has been reviewed and approved by our team. It is now live and visible to all users!</p>

    <div style="background:#f5f3ff;border-radius:10px;padding:20px;margin:20px 0;">
      <div class="detail-row"><span>Event</span><strong>${event.title}</strong></div>
      <div class="detail-row"><span>Date</span><span>${new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
      <div class="detail-row"><span>Venue</span><span>${event.location.venue}, ${event.location.city}</span></div>
      <div class="detail-row"><span>Status</span><span style="color:#059669;font-weight:bold;">Published ✓</span></div>
    </div>

    <div style="text-align:center;">
      <a href="${FRONTEND}/events/${event._id}" class="btn" style="background:linear-gradient(135deg,#7c3aed,#4f46e5);">View Your Event</a>
    </div>
    <p>The EventMe Team</p>
  </div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p></div>
</div>
</body></html>`;

// ── Event Rejected (to organizer) ─────────────────────────────────────────────
export const eventRejectedEmailTemplate = (organizerName, event, reason) => `
<!DOCTYPE html><html><head><style>${BASE_STYLES}</style></head><body>
<div class="container">
  <div class="header" style="background: linear-gradient(135deg, #dc2626, #ef4444);">
    <h1>❌ Event Not Approved</h1>
  </div>
  <div class="content">
    <h2>Hi ${organizerName},</h2>
    <p>Unfortunately, your event <strong>${event.title}</strong> was not approved at this time.</p>

    <div style="background:#fef2f2;border-left:4px solid #dc2626;border-radius:4px;padding:16px;margin:20px 0;">
      <strong>Reason:</strong>
      <p style="margin:8px 0 0;">${reason || 'No specific reason provided. Please contact support for details.'}</p>
    </div>

    <p>You can edit your event to address the feedback and resubmit for review.</p>
    <div style="text-align:center;">
      <a href="${FRONTEND}/edit-event/${event._id}" class="btn" style="background:linear-gradient(135deg,#dc2626,#ef4444);">Edit Event</a>
    </div>
    <p>The EventMe Team</p>
  </div>
  <div class="footer"><p>&copy; ${new Date().getFullYear()} EventMe. All rights reserved.</p></div>
</div>
</body></html>`;

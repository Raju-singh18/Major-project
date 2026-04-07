import PDFDocument from 'pdfkit';

/**
 * Generates a professional booking receipt PDF.
 * Real-world design: header band, ticket stub with barcode area,
 * perforated divider, itemized breakdown, payment info, footer.
 */
export const generateReceiptPdf = (booking, event, user, type = 'confirmed') => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks = [];
    doc.on('data', c => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = 595, M = 40;
    const isConfirmed = type === 'confirmed';
    const isFree = booking.totalAmount === 0;

    // ── Colours ──────────────────────────────────────────────────────────────
    const PURPLE  = '#7c3aed';
    const GREEN   = '#059669';
    const RED     = '#dc2626';
    const DARK    = '#111827';
    const MID     = '#374151';
    const GRAY    = '#6b7280';
    const LGRAY   = '#9ca3af';
    const BORDER  = '#e5e7eb';
    const LIGHT   = '#f9fafb';
    const PURPLE_L = '#f5f3ff';

    const accent = isConfirmed ? PURPLE : RED;
    const accentLight = isConfirmed ? PURPLE_L : '#fef2f2';

    // ── Helper: horizontal rule ───────────────────────────────────────────────
    const hr = (y, color = BORDER, w = 1) =>
      doc.moveTo(M, y).lineTo(W - M, y).strokeColor(color).lineWidth(w).stroke();

    // ═══════════════════════════════════════════════════════════════════════════
    // HEADER GRADIENT BAND
    // ═══════════════════════════════════════════════════════════════════════════
    doc.rect(0, 0, W, 110).fill(accent);

    // Logo area
    doc.fillColor('white').fontSize(26).font('Helvetica-Bold').text('EventMe', M, 28);
    doc.fillColor('rgba(255,255,255,0.7)').fontSize(9).font('Helvetica')
       .text('Your Event Booking Platform', M, 58)
       .text('support@eventme.com  ·  eventme.com', M, 72);

    // Status pill (top right)
    const pillX = W - 185, pillY = 28;
    doc.roundedRect(pillX, pillY, 145, 54, 10)
       .fill('rgba(255,255,255,0.18)');

    const pillTextColor = isConfirmed ? '#059669' : '#dc2626';
    doc.fillColor(pillTextColor).fontSize(13).font('Helvetica-Bold')
       .text(isConfirmed ? '[OK]' : '[X]', pillX + 10, pillY + 8);
    doc.fillColor(pillTextColor).fontSize(10).font('Helvetica-Bold')
       .text(isConfirmed ? 'CONFIRMED' : 'CANCELLED', pillX + 10, pillY + 26);
    doc.fillColor('rgba(255,255,255,0.75)').fontSize(8).font('Helvetica')
       .text(isConfirmed ? 'Booking successful' : 'Booking cancelled', pillX + 10, pillY + 40);

    // ═══════════════════════════════════════════════════════════════════════════
    // RECEIPT TITLE ROW
    // ═══════════════════════════════════════════════════════════════════════════
    let y = 128;
    doc.fillColor(DARK).fontSize(17).font('Helvetica-Bold')
       .text(isConfirmed ? 'Booking Confirmation Receipt' : 'Cancellation Receipt', M, y);
    doc.fillColor(LGRAY).fontSize(8.5).font('Helvetica')
       .text(`Generated: ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}`, M, y + 22);

    // ═══════════════════════════════════════════════════════════════════════════
    // BOOKING REFERENCE BAND
    // ═══════════════════════════════════════════════════════════════════════════
    y = 168;
    doc.rect(M, y, W - M * 2, 52).fill(accentLight).stroke(BORDER);

    doc.fillColor(GRAY).fontSize(7.5).font('Helvetica')
       .text('BOOKING REFERENCE', M + 14, y + 10, { characterSpacing: 1 });
    doc.fillColor(accent).fontSize(17).font('Helvetica-Bold')
       .text(booking.bookingReference, M + 14, y + 22);

    // Status badge right side
    const badgeColor = isConfirmed ? GREEN : RED;
    doc.fillColor(GRAY).fontSize(7.5).font('Helvetica')
       .text('STATUS', W - 160, y + 10, { characterSpacing: 1 });
    doc.circle(W - 160, y + 32, 5).fill(badgeColor);
    doc.fillColor(badgeColor).fontSize(11).font('Helvetica-Bold')
       .text(isConfirmed ? 'Confirmed' : 'Cancelled', W - 150, y + 26);

    // Booking date far right
    doc.fillColor(GRAY).fontSize(7.5).font('Helvetica')
       .text('BOOKED ON', W - 290, y + 10, { characterSpacing: 1 });
    doc.fillColor(MID).fontSize(9).font('Helvetica-Bold')
       .text(new Date(booking.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }), W - 290, y + 24);

    // ═══════════════════════════════════════════════════════════════════════════
    // TWO-COLUMN: CUSTOMER  |  EVENT
    // ═══════════════════════════════════════════════════════════════════════════
    y = 240;
    const col1 = M, col2 = W / 2 + 10;
    const colW = W / 2 - M - 10;

    // Column headers
    doc.fillColor(accent).fontSize(9).font('Helvetica-Bold')
       .text('CUSTOMER DETAILS', col1, y, { characterSpacing: 0.5 });
    doc.fillColor(accent).fontSize(9).font('Helvetica-Bold')
       .text('EVENT DETAILS', col2, y, { characterSpacing: 0.5 });

    hr(y + 13, accent, 0.8);

    y += 22;
    // Customer rows
    [
      ['Name', user.name],
      ['Email', user.email],
      ['Booking Date', new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })],
    ].forEach(([label, value], i) => {
      const ry = y + i * 20;
      doc.fillColor(GRAY).fontSize(8.5).font('Helvetica').text(label, col1, ry);
      doc.fillColor(DARK).fontSize(8.5).font('Helvetica-Bold').text(value, col1 + 70, ry, { width: colW - 70 });
    });

    // Event rows
    const eventTitle = event.title.length > 32 ? event.title.slice(0, 32) + '...' : event.title;
    [
      ['Event', eventTitle],
      ['Date', new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })],
      ['Time', event.time],
      ['Venue', `${event.location.venue}`],
      ['City', `${event.location.city}, ${event.location.country}`],
    ].forEach(([label, value], i) => {
      const ry = y + i * 20;
      doc.fillColor(GRAY).fontSize(8.5).font('Helvetica').text(label, col2, ry);
      doc.fillColor(DARK).fontSize(8.5).font('Helvetica-Bold').text(value, col2 + 50, ry, { width: colW - 50 });
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // PERFORATED DIVIDER (ticket stub style)
    // ═══════════════════════════════════════════════════════════════════════════
    y += 120;
    // Dashed line
    doc.save();
    doc.dash(4, { space: 4 });
    doc.moveTo(M, y).lineTo(W - M, y).strokeColor(LGRAY).lineWidth(1).stroke();
    doc.undash();
    doc.restore();
    // Scissors hint — ASCII only
    doc.fillColor(LGRAY).fontSize(8).font('Helvetica').text('- - -', M - 12, y - 5);

    // ═══════════════════════════════════════════════════════════════════════════
    // TICKET STUB SECTION
    // ═══════════════════════════════════════════════════════════════════════════
    y += 14;
    doc.rect(M, y, W - M * 2, 70).fill(LIGHT).stroke(BORDER);

    // Left: ticket icon area
    doc.rect(M, y, 70, 70).fill(isConfirmed ? PURPLE_L : '#fef2f2').stroke(BORDER);
    doc.fillColor(accent).fontSize(11).font('Helvetica-Bold')
       .text('TICKET', M + 8, y + 26);

    // Middle: event summary
    doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold')
       .text(eventTitle, M + 82, y + 10, { width: 280 });
    doc.fillColor(GRAY).fontSize(8.5).font('Helvetica')
       .text(`${new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · ${event.time}`, M + 82, y + 28, { width: 280 });
    doc.fillColor(MID).fontSize(8.5).font('Helvetica')
       .text(`Venue: ${event.location.venue}, ${event.location.city}`, M + 82, y + 44, { width: 280 });

    // Right: total amount
    const totalLabel = isFree ? 'FREE' : `Rs.${booking.totalAmount.toFixed(2)}`;
    doc.fillColor(GRAY).fontSize(7.5).font('Helvetica')
       .text('TOTAL PAID', W - 120, y + 14, { width: 80, align: 'center' });
    doc.fillColor(isFree ? GREEN : accent).fontSize(isFree ? 18 : 16).font('Helvetica-Bold')
       .text(totalLabel, W - 120, y + 28, { width: 80, align: 'center' });

    // ═══════════════════════════════════════════════════════════════════════════
    // TICKET BREAKDOWN TABLE
    // ═══════════════════════════════════════════════════════════════════════════
    y += 88;
    doc.fillColor(accent).fontSize(9).font('Helvetica-Bold')
       .text('TICKET BREAKDOWN', M, y, { characterSpacing: 0.5 });
    hr(y + 13, accent, 0.8);

    // Table header
    y += 20;
    doc.rect(M, y, W - M * 2, 22).fill(accent);
    doc.fillColor('white').fontSize(8.5).font('Helvetica-Bold')
       .text('TICKET TYPE', M + 10, y + 6)
       .text('QTY', 310, y + 6)
       .text('UNIT PRICE', 360, y + 6)
       .text('SUBTOTAL', 460, y + 6);

    // Table rows
    y += 26;
    booking.tickets.forEach((ticket, i) => {
      if (i % 2 === 0) doc.rect(M, y - 3, W - M * 2, 20).fill(LIGHT);
      const unitPrice = ticket.price === 0 ? 'FREE' : `Rs.${ticket.price.toFixed(2)}`;
      const subtotal  = ticket.price === 0 ? 'FREE' : `Rs.${(ticket.price * ticket.quantity).toFixed(2)}`;
      doc.fillColor(DARK).fontSize(8.5).font('Helvetica')
         .text(ticket.ticketType, M + 10, y)
         .text(String(ticket.quantity), 318, y)
         .text(unitPrice, 360, y)
         .text(subtotal, 460, y);
      y += 20;
    });

    // Total row
    doc.rect(M, y + 2, W - M * 2, 26).fill(accentLight).stroke(BORDER);
    doc.fillColor(DARK).fontSize(10).font('Helvetica-Bold').text('TOTAL', M + 10, y + 8);
    doc.fillColor(isFree ? GREEN : accent).fontSize(13).font('Helvetica-Bold')
       .text(isFree ? 'FREE' : `Rs.${booking.totalAmount.toFixed(2)}`, 440, y + 7);

    // ═══════════════════════════════════════════════════════════════════════════
    // PAYMENT INFO
    // ═══════════════════════════════════════════════════════════════════════════
    y += 46;
    doc.fillColor(accent).fontSize(9).font('Helvetica-Bold')
       .text('PAYMENT INFORMATION', M, y, { characterSpacing: 0.5 });
    hr(y + 13, accent, 0.8);
    y += 22;

    const payStatus = isFree ? 'Free Registration' : isConfirmed ? 'Completed' : 'Refund Pending (5–7 business days)';
    [
      ['Payment Status', payStatus, isConfirmed ? GREEN : RED],
      ['Payment Method', isFree ? 'No payment required' : 'Online Payment (Razorpay)'],
      ['Payment ID', booking.paymentId || (isFree ? 'N/A — Free Event' : 'N/A')],
      ['Order ID', booking.orderId || (isFree ? 'N/A — Free Event' : 'N/A')],
    ].forEach(([label, value, color], i) => {
      doc.fillColor(GRAY).fontSize(8.5).font('Helvetica').text(label, M, y + i * 18);
      doc.fillColor(color || DARK).fontSize(8.5).font('Helvetica-Bold').text(value, 200, y + i * 18, { width: W - 200 - M });
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // CANCELLATION NOTICE (if cancelled)
    // ═══════════════════════════════════════════════════════════════════════════
    if (!isConfirmed) {
      y += 90;
      doc.rect(M, y, W - M * 2, 56).fill('#fef2f2').stroke('#fecaca');
      doc.fillColor(RED).fontSize(9).font('Helvetica-Bold')
         .text('CANCELLATION NOTICE', M + 12, y + 10, { characterSpacing: 0.3 });
      doc.fillColor('#7f1d1d').fontSize(8.5).font('Helvetica')
         .text(
           isFree
             ? 'Your free registration has been cancelled. Your spot has been released back to the event.'
             : 'This booking has been cancelled. If you paid online, a refund will be processed within 5–7 business days to your original payment method. For queries, contact support@eventme.com.',
           M + 12, y + 26, { width: W - M * 2 - 24 }
         );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // IMPORTANT NOTES BOX
    // ═══════════════════════════════════════════════════════════════════════════
    if (isConfirmed) {
      y += 90;
      doc.rect(M, y, W - M * 2, 56).fill('#eff6ff').stroke('#bfdbfe');
      doc.fillColor('#1d4ed8').fontSize(9).font('Helvetica-Bold')
         .text('IMPORTANT INFORMATION', M + 12, y + 10, { characterSpacing: 0.3 });
      doc.fillColor('#1e3a8a').fontSize(8.5).font('Helvetica')
         .text(
           'Please carry this receipt (printed or digital) to the venue. You may be asked to show your Booking Reference at the entry. Arrive at least 15 minutes before the event starts.',
           M + 12, y + 26, { width: W - M * 2 - 24 }
         );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════════════════════════════════════
    const footerY = 768;
    doc.rect(0, footerY, W, 74).fill(DARK);
    doc.fillColor('white').fontSize(11).font('Helvetica-Bold').text('EventMe', M, footerY + 14);
    doc.fillColor('rgba(255,255,255,0.6)').fontSize(8).font('Helvetica')
       .text('Your Event Booking Platform', M, footerY + 30)
       .text('support@eventme.com  ·  eventme.com', M, footerY + 44);

    doc.fillColor('rgba(255,255,255,0.4)').fontSize(7.5).font('Helvetica')
       .text('This is a computer-generated receipt and does not require a signature.', M, footerY + 58, { width: W - M * 2, align: 'right' });

    doc.end();
  });
};

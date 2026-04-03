# 🎫 Payment Testing Guide - EventMe

## 🚨 EASIEST SOLUTION: Use Test Payment Mode

If Razorpay keeps rejecting payments with "International cards not supported", use the built-in Test Payment mode:

### ✅ Test Payment Mode (100% Success - No Razorpay Required)

1. Go to any event page
2. Select ticket quantity
3. Click "Book Tickets"
4. Razorpay modal will open and likely fail
5. **After it fails**, scroll down in the booking card
6. You'll see an orange "Test Payment" button appear
7. Click **"🧪 Use Test Payment (Development Mode)"**
8. ✅ Booking completes instantly!

This bypasses Razorpay entirely and creates a mock booking for testing purposes.

---

## 🚨 Quick Fix for "International Cards Not Allowed" Error

If you're getting the error: **"International cards are not supported"**, follow these steps:

### ✅ Solution 1: Use UPI (RECOMMENDED - 100% Success Rate)

1. Click "Book Tickets" on any event
2. In the Razorpay payment modal, select **"UPI"** tab
3. Enter UPI ID: `success@razorpay`
4. Click "Pay"
5. ✅ Payment will succeed immediately!

### ✅ Solution 2: Use Net Banking

1. Click "Book Tickets" on any event
2. In the Razorpay payment modal, select **"Net Banking"** tab
3. Choose any bank from the dropdown
4. Click "Pay"
5. On the test page, click **"Success"** button
6. ✅ Payment completed!

### ✅ Solution 3: Use Indian Test Cards

Only use these specific domestic test cards:

**RuPay Card (Best for India):**
```
Card Number: 6076 6500 0000 0008
Expiry: 12/25
CVV: 123
Name: Test User
```

**Mastercard (Domestic):**
```
Card Number: 5104 0600 0000 0008
Expiry: 12/25
CVV: 123
Name: Test User
```

---

## 🎯 Step-by-Step Payment Testing

### Step 1: Select an Event
- Go to http://localhost:5173/events
- Click on any event card

### Step 2: Choose Tickets
- Select quantity for ticket types (VIP, Regular, etc.)
- Review total amount

### Step 3: Click "Book Tickets"
- If not logged in, you'll be redirected to login
- After login, Razorpay payment modal will open

### Step 4: Complete Payment (Choose ONE method)

#### Option A: UPI (Fastest & Most Reliable)
```
1. Click "UPI" tab
2. Enter: success@razorpay
3. Click "Pay"
4. ✅ Done!
```

#### Option B: Net Banking
```
1. Click "Net Banking" tab
2. Select any bank
3. Click "Pay"
4. Click "Success" on test page
5. ✅ Done!
```

#### Option C: Card Payment
```
1. Click "Cards" tab
2. Enter card details:
   - Number: 6076 6500 0000 0008
   - Expiry: 12/25
   - CVV: 123
   - Name: Test User
3. Click "Pay"
4. If OTP requested, enter: 1234
5. ✅ Done!
```

### Step 5: Verify Booking
- You'll be redirected to "My Bookings" page
- Check your booking details
- Check notifications (bell icon) for confirmation

---

## ❌ Common Errors & Solutions

### Error: "International cards are not supported"
**Cause:** Razorpay test account has international payments disabled  
**Solution:** Use UPI (`success@razorpay`) or Net Banking instead of cards

### Error: "Payment could not be completed"
**Cause:** Invalid card number or payment method issue  
**Solution:** 
1. Try UPI method first
2. If using cards, use only the domestic cards listed above
3. Avoid international card numbers (starting with 4111, 5555, etc.)

### Error: "BAD_REQUEST_ERROR"
**Cause:** Payment method not supported or invalid credentials  
**Solution:**
1. Switch to UPI payment method
2. Verify Razorpay credentials in `server/.env`
3. Restart server after changing .env

### Payment Modal Doesn't Open
**Cause:** Razorpay script not loaded  
**Solution:**
1. Check browser console for errors
2. Verify `client/index.html` has Razorpay script
3. Clear browser cache and reload

---

## 🔐 Current Configuration

### Razorpay Credentials (Test Mode)
Located in: `server/.env`
```
RAZORPAY_KEY=rzp_test_SO1nfRxNVXLSyW
RAZORPAY_SECRET=aNr6RISwHPsk3Ji263pbXOA1
```

### Payment Features Implemented
✅ Razorpay integration  
✅ Order creation  
✅ Payment verification  
✅ Signature validation  
✅ Booking confirmation  
✅ Notification system  
✅ Error handling  
✅ International card detection  
✅ Suspended user blocking  

---

## 🧪 Testing Checklist

- [ ] Test UPI payment (`success@razorpay`)
- [ ] Test Net Banking payment
- [ ] Test RuPay card payment
- [ ] **Test Payment Mode (Recommended for development)**
- [ ] Test payment cancellation (close modal)
- [ ] Test with suspended user account
- [ ] Test with insufficient tickets
- [ ] Test booking confirmation notification
- [ ] Test "My Bookings" page shows new booking
- [ ] Test booking reference generation
- [ ] Test ticket quantity updates after booking

---

## 🎯 Recommended Testing Workflow

**For Development (Fastest):**
1. Try to book tickets normally
2. When Razorpay fails, use the "Test Payment" button that appears
3. Booking completes instantly without any payment gateway

**For Production Testing:**
1. Use UPI: `success@razorpay`
2. Or use Net Banking
3. Avoid cards if international payments are disabled

---

## 📱 Payment Methods Priority

**For Testing (Recommended Order):**
1. 🥇 **UPI** - `success@razorpay` (Instant, 100% success)
2. 🥈 **Net Banking** - Any bank → Success button
3. 🥉 **RuPay Card** - `6076 6500 0000 0008`
4. ❌ **International Cards** - NOT SUPPORTED

---

## 🎉 Success Indicators

After successful payment, you should see:
1. ✅ Success toast message
2. ✅ Redirect to "My Bookings" page
3. ✅ New booking appears in list
4. ✅ Booking reference number generated
5. ✅ Notification badge updates (bell icon)
6. ✅ Event ticket count decreases
7. ✅ Payment status shows "Completed"

---

## 🆘 Need Help?

If payment still fails:
1. Check browser console for detailed errors
2. Check server logs for Razorpay API errors
3. Verify Razorpay credentials are active in dashboard
4. Try UPI method as it has highest success rate
5. Ensure you're using TEST mode credentials (rzp_test_...)

---

## 📚 Additional Resources

- [Razorpay Test Cards Documentation](./RAZORPAY_TEST_CARDS.md)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)
- [Razorpay Test Mode Guide](https://razorpay.com/docs/payments/payments/test-card-details/)

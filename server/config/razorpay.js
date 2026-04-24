import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const RAZORPAY_KEY = process.env.RAZORPAY_KEY?.trim();
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET?.trim();

// Log configuration status
if (!RAZORPAY_KEY || !RAZORPAY_SECRET) {
  console.error("Razorpay credentials are missing in .env file");
  console.error("RAZORPAY_KEY:", RAZORPAY_KEY ? "Present" : "Missing");
  console.error("RAZORPAY_SECRET:", RAZORPAY_SECRET ? "Present" : "Missing");
} else {
  console.log("Razorpay configured successfully");
  console.log("Key ID:", RAZORPAY_KEY.substring(0, 15) + "...");
}

export const instance = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET,
});

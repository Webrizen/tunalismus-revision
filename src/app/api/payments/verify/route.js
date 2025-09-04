import { NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "../../../../models/Payment";
import connectToDB from "../../../../lib/mongodb";

export async function POST(req) {
  await connectToDB();

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid",
      }
    );

    return NextResponse.json({ message: "Payment successful" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
  }
}

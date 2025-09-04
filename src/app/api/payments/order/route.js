import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import Course from "../../../../models/Course";
import Payment from "../../../../models/Payment";
import connectToDB from "../../../../lib/mongodb";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  await connectToDB();

  const userId = req.headers.get("X-User-Id");
  const { courseId } = await req.json();

  if (!courseId) {
    return NextResponse.json({ message: "Course ID is required" }, { status: 400 });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return NextResponse.json({ message: "Course not found" }, { status: 404 });
  }

  const options = {
    amount: course.price * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);

    await Payment.create({
      user: userId,
      course: courseId,
      amount: course.price,
      currency: "INR",
      status: "created",
      razorpayOrderId: order.id,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

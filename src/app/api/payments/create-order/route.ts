import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, amount } = await req.json();

    if (!propertyId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_secret",
    });

    const amountInPaise = Math.round(parseFloat(amount) * 100);

    // Create an order in Razorpay
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Save payment intent in DB
    const payment = await prisma.payment.create({
      data: {
        userId: (session.user as any).id,
        propertyId,
        amount: parseFloat(amount),
        status: "PENDING",
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({ orderId: order.id, paymentId: payment.id, amount: amountInPaise });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}

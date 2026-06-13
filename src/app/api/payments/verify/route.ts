import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentDbId,
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET || "dummy_secret";

    // Verify signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpay_signature) {
      return NextResponse.json({ error: "Transaction not legit!" }, { status: 400 });
    }

    // Update payment status
    const payment = await prisma.payment.update({
      where: { id: paymentDbId },
      data: {
        status: "COMPLETED",
        razorpayPaymentId: razorpay_payment_id,
      },
      include: {
        property: true,
        user: true,
      },
    });

    // Send email receipt asynchronously
    try {
      await sendReceiptEmail(payment.user.email, payment.user.name, payment.amount, payment.property.title, razorpay_payment_id);
    } catch (emailError) {
      console.error("Failed to send receipt email:", emailError);
      // We don't fail the verification if email fails
    }

    return NextResponse.json({
      message: "Payment verified successfully",
      isOk: true,
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

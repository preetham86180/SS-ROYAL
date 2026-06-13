import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch payments for the logged in user
    const payments = await prisma.payment.findMany({
      where: {
        userId: userId,
      },
      include: {
        property: {
          select: {
            title: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error("Error fetching payment history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

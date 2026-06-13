import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user by email to get their ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch properties assigned to this user
    const properties = await prisma.property.findMany({
      where: { assignedClientId: user.id },
      select: {
        id: true,
        title: true,
        location: true,
        propertyNumber: true,
      },
    });

    return NextResponse.json({ properties });
  } catch (error) {
    console.error("Error fetching assigned properties:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

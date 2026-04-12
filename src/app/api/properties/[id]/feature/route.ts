import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isFeatured } = body;

    if (typeof isFeatured !== "boolean") {
      return NextResponse.json({ error: "isFeatured must be a boolean" }, { status: 400 });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { isFeatured },
    });

    // Revalidate paths so the UI updates instantly
    revalidatePath("/");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, property: updatedProperty });
  } catch (err: any) {
    console.error("Error updating featured status:", err);
    return NextResponse.json(
      { error: "Failed to update property status", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

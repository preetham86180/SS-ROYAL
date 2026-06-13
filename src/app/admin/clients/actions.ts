"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignProperty(clientId: string, formData: FormData) {
  const propertyNumber = formData.get("propertyNumber") as string;
  if (!propertyNumber) return { error: "Property Number is required" };

  const property = await prisma.property.findUnique({
    where: { propertyNumber: propertyNumber.toUpperCase() }
  });

  if (!property) {
    return { error: "Property not found" };
  }

  await prisma.property.update({
    where: { id: property.id },
    data: { assignedClientId: clientId }
  });

  revalidatePath("/admin/clients");
  return { success: true };
}

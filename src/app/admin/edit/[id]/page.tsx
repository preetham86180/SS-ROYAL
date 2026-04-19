import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditPropertyForm } from "./EditPropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) notFound();

  return <EditPropertyForm property={property} />;
}

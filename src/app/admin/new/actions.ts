"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

const prisma = new PrismaClient();

async function saveUploadedFile(file: File, folder: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  if (!existsSync(uploadsDir)) {
    await fs.mkdir(uploadsDir, { recursive: true });
  }

  const timestamp = Date.now();
  const ext = path.extname(file.name) || ".jpg";
  const safeName = `${timestamp}_${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(uploadsDir, safeName);

  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return `/uploads/${folder}/${safeName}`;
}

export async function createProperty(formData: FormData) {
  // ─── Base fields ───────────────────────────────────────────────
  const title       = formData.get("title") as string || "Untitled";
  const description = formData.get("description") as string || "";
  const price       = parseFloat(formData.get("price") as string) || 0;
  const location    = formData.get("location") as string || "Unknown";
  const bedrooms    = parseInt(formData.get("bedrooms") as string) || 1;
  const bathrooms   = 1;
  const area        = parseFloat(formData.get("area") as string) || 0;
  const features    = formData.get("features") as string || "";

  // ─── Thumbnail upload ──────────────────────────────────────────
  const thumbnailFile = formData.get("thumbnail") as File | null;
  let imageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";
  if (thumbnailFile && thumbnailFile.size > 0) {
    imageUrl = await saveUploadedFile(thumbnailFile, "thumbnails");
  }

  // ─── Gallery uploads (max 10) ──────────────────────────────────
  const galleryFiles = formData.getAll("gallery") as File[];
  const validGallery = galleryFiles.filter(f => f && f.size > 0).slice(0, 10);
  const galleryPaths: string[] = [];
  for (const file of validGallery) {
    const savedPath = await saveUploadedFile(file, "gallery");
    galleryPaths.push(savedPath);
  }
  const galleryImages = galleryPaths.length > 0 ? JSON.stringify(galleryPaths) : null;

  // ─── Property Information fields ──────────────────────────────
  const status       = formData.get("status") as string;
  const propertyType = formData.get("propertyType") as string;
  const plotArea     = formData.get("plotArea") ? parseFloat(formData.get("plotArea") as string) : null;
  const transaction  = formData.get("transaction") as string;
  const furnishing   = formData.get("furnishing") as string;
  const propertyAge  = formData.get("propertyAge") as string;

  // ─── Location fields ──────────────────────────────────────────
  const flatUnitNo  = formData.get("flatUnitNo") as string;
  const buildingName = formData.get("buildingName") as string;
  const street      = formData.get("street") as string;
  const landmark    = formData.get("landmark") as string;
  const pinCode     = formData.get("pinCode") as string;
  const address     = formData.get("address") as string;
  const city        = formData.get("city") as string;

  // ─── Description fields ───────────────────────────────────────
  const youtubeUrl = formData.get("youtubeUrl") as string;

  await prisma.property.create({
    data: {
      title, description, price, location, bedrooms, bathrooms,
      area, imageUrl, features, galleryImages,
      status, propertyType, plotArea,
      transaction, furnishing, propertyAge,
      flatUnitNo, buildingName, street, landmark, pinCode, address, city,
      youtubeUrl,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

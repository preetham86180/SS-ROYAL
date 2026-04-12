import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import path from "path";
import { put } from "@vercel/blob";

import { prisma } from "@/lib/prisma";

async function saveUploadedFile(file: File, folder: string): Promise<string> {
  try {
    const timestamp = Date.now();
    const ext = path.extname(file.name) || ".jpg";
    const safeName = `${folder}/${timestamp}_${Math.random().toString(36).slice(2)}${ext}`;
    
    const blob = await put(safeName, file, { access: 'public' });
    return blob.url;
  } catch (error) {
    console.error("Vercel Blob Upload failed:", error);
    // Fallback to a placeholder image
    return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ─── Base fields ───────────────────────────────────────────
    const title       = (formData.get("title") as string) || "Untitled";
    const description = (formData.get("description") as string) || "";
    const price       = parseFloat(formData.get("price") as string) || 0;
    const location    = (formData.get("location") as string) || "Unknown";
    const bedrooms    = parseInt(formData.get("bedrooms") as string) || 1;
    const area        = parseFloat(formData.get("area") as string) || 0;
    const features    = (formData.get("features") as string) || "";

    // ─── Thumbnail ─────────────────────────────────────────────
    const thumbnailFile = formData.get("thumbnail") as File | null;
    let imageUrl = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";
    if (thumbnailFile && thumbnailFile.size > 0) {
      imageUrl = await saveUploadedFile(thumbnailFile, "thumbnails");
    }

    // ─── Gallery (max 10) ──────────────────────────────────────
    const galleryFiles = formData.getAll("gallery") as File[];
    const validGallery = galleryFiles.filter(f => f && f.size > 0).slice(0, 10);
    const galleryPaths: string[] = [];
    for (const file of validGallery) {
      galleryPaths.push(await saveUploadedFile(file, "gallery"));
    }
    const galleryImages = galleryPaths.length > 0 ? JSON.stringify(galleryPaths) : null;

    // ─── Property Information ──────────────────────────────────
    const status       = formData.get("status") as string;
    const propertyType = formData.get("propertyType") as string;
    const plotAreaRaw  = formData.get("plotArea") as string;
    const plotArea     = plotAreaRaw && !isNaN(parseFloat(plotAreaRaw)) ? parseFloat(plotAreaRaw) : null;
    const transaction  = formData.get("transaction") as string;
    const furnishing   = formData.get("furnishing") as string;
    const propertyAge  = formData.get("propertyAge") as string;

    // ─── Location ──────────────────────────────────────────────
    const flatUnitNo   = formData.get("flatUnitNo") as string;
    const buildingName = formData.get("buildingName") as string;
    const street       = formData.get("street") as string;
    const landmark     = formData.get("landmark") as string;
    const pinCode      = formData.get("pinCode") as string;
    const address      = formData.get("address") as string;
    const city         = formData.get("city") as string;
    const youtubeUrl   = formData.get("youtubeUrl") as string;

    await prisma.property.create({
      data: {
        title, description, price, location,
        bedrooms, bathrooms: 1, area, imageUrl,
        features, galleryImages,
        status, propertyType, plotArea,
        transaction, furnishing, propertyAge,
        flatUnitNo, buildingName, street, landmark,
        pinCode, address, city, youtubeUrl,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error creating property:", err);
    return NextResponse.json(
      { error: "Failed to create property", detail: err?.message || String(err) },
      { status: 500 }
    );
  }
}

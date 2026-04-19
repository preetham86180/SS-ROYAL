"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Image as ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { updateProperty } from "./actions";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  galleryImages: string | null;
  status: string | null;
  propertyType: string | null;
  plotArea: number | null;
  transaction: string | null;
  furnishing: string | null;
  propertyAge: string | null;
  flatUnitNo: string | null;
  buildingName: string | null;
  street: string | null;
  landmark: string | null;
  pinCode: string | null;
  address: string | null;
  city: string | null;
  youtubeUrl: string | null;
  features: string;
}

export function EditPropertyForm({ property }: { property: Property }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState(property.description || "");
  const [address, setAddress] = useState(property.address || "");

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    property.imageUrl || null
  );
  const thumbnailRef = useRef<HTMLInputElement>(null);

  // Gallery state — start with existing saved gallery
  const existingGallery: string[] = (() => {
    try { return JSON.parse(property.galleryImages || "[]"); } catch { return []; }
  })();
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>(existingGallery);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleThumbnail = (file: File) => {
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleGallery = (files: FileList) => {
    const incoming = Array.from(files);
    const totalSlots = 10 - existingGalleryUrls.length;
    const combined = [...galleryFiles, ...incoming].slice(0, totalSlots);
    setGalleryFiles(combined);
    setGalleryPreviews(combined.map(f => URL.createObjectURL(f)));
  };

  const removeNewGallery = (idx: number) => {
    const updated = galleryFiles.filter((_, i) => i !== idx);
    setGalleryFiles(updated);
    setGalleryPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const removeExistingGallery = (idx: number) => {
    setExistingGalleryUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Send existing gallery that hasn't been removed
    fd.set("existingGallery", JSON.stringify(existingGalleryUrls));
    // Replace gallery files
    fd.delete("gallery");
    galleryFiles.forEach(f => fd.append("gallery", f));

    try {
      await updateProperty(property.id, fd);
    } catch (err: any) {
      // redirect throws internally, so catch only real errors
      if (!err?.message?.includes("NEXT_REDIRECT")) {
        alert("Update failed. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const labelClass = "block text-[13px] text-gray-500 mb-1.5 font-medium";
  const inputClass =
    "w-full border border-gray-200 rounded text-sm px-3 py-2 text-gray-700 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400";
  const sectionHeaderClass =
    "text-xs font-bold text-gray-700 tracking-wider mb-6 flex items-center";

  const totalGallery = existingGalleryUrls.length + galleryFiles.length;

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Back link */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <h1 className="text-2xl font-display font-bold text-gray-900 mb-8">
        Edit Property
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[#fafafa] p-8 md:p-12 border border-gray-100 rounded-sm"
      >
        {/* Hidden field — existing image url fallback */}
        <input type="hidden" name="existingImageUrl" value={property.imageUrl || ""} />

        {/* ── PROPERTY INFORMATION ────────────────────────────────── */}
        <div className="mb-12">
          <h2 className={sectionHeaderClass}>
            <span className="text-gray-900 mr-2">PROPERTY</span> INFORMATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <div>
              <label className={labelClass}>Status*</label>
              <select name="status" required className={inputClass} defaultValue={property.status || ""}>
                <option value="" disabled hidden>Select</option>
                <option value="SALE">Sale</option>
                <option value="SOLD">Sold</option>
                <option value="RENT">Rent</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Type*</label>
              <select name="propertyType" required className={inputClass} defaultValue={property.propertyType || ""}>
                <option value="" disabled hidden>Select</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Price*</label>
              <input name="price" type="number" required className={inputClass} defaultValue={property.price} />
            </div>
            <div>
              <label className={labelClass}>Area (Sq.ft)*</label>
              <input name="area" type="number" required className={inputClass} defaultValue={property.area} />
            </div>
            <div>
              <label className={labelClass}>Plot Area (Sq.ft)</label>
              <input name="plotArea" type="number" className={inputClass} defaultValue={property.plotArea ?? ""} />
            </div>
            <div>
              <label className={labelClass}>Bedroom</label>
              <select name="bedrooms" className={inputClass} defaultValue={String(property.bedrooms || "")}>
                <option value="" disabled hidden>Select</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Transaction</label>
              <select name="transaction" className={inputClass} defaultValue={property.transaction || ""}>
                <option value="" disabled hidden>Select</option>
                <option value="New">New</option>
                <option value="Resale">Resale</option>
                <option value="Pre Launch">Pre Launch</option>
                <option value="Pre Lease/ Pre Rented">Pre Lease/ Pre Rented</option>
                <option value="Individual">Individual</option>
                <option value="Company">Company</option>
                <option value="Distress Sale">Distress Sale</option>
                <option value="Group Booking">Group Booking</option>
                <option value="Individual / Company">Individual / Company</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Furnishing</label>
              <select name="furnishing" className={inputClass} defaultValue={property.furnishing || ""}>
                <option value="" disabled hidden>Select</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="UnFurnished">UnFurnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Ready to Furnished">Ready to Furnished</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Age</label>
              <select name="propertyAge" className={inputClass} defaultValue={property.propertyAge || ""}>
                <option value="" disabled hidden>Select</option>
                <option value="Under Construction">Under Construction</option>
                <option value="Less than 5 years">Less than 5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10-20 years">10-20 years</option>
                <option value="More than 20 years">More than 20 years</option>
                <option value="Less than 6 months">Less than 6 months</option>
                <option value="Less than 1 years">Less than 1 years</option>
                <option value="Less than 1.5 years">Less than 1.5 years</option>
                <option value="Less than 2 years">Less than 2 years</option>
                <option value="Less than 3 years">Less than 3 years</option>
                <option value="New">New</option>
                <option value="Ready for Sale">Ready for Sale</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── LOCATION INFORMATION ─────────────────────────────────── */}
        <div className="mb-12">
          <h2 className={sectionHeaderClass}>
            <span className="text-gray-900 mr-2">LOCATION</span> INFORMATION
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-6">
            <div>
              <label className={labelClass}>Flat No./Unit No.</label>
              <input name="flatUnitNo" type="text" className={inputClass} defaultValue={property.flatUnitNo || ""} />
            </div>
            <div>
              <label className={labelClass}>Property Name</label>
              <input name="title" type="text" className={inputClass} defaultValue={property.title} />
            </div>
            <div>
              <label className={labelClass}>Building Name</label>
              <input name="buildingName" type="text" className={inputClass} defaultValue={property.buildingName || ""} />
            </div>
            <div>
              <label className={labelClass}>Street</label>
              <input name="street" type="text" className={inputClass} defaultValue={property.street || ""} />
            </div>
            <div>
              <label className={labelClass}>Landmark</label>
              <input name="landmark" type="text" className={inputClass} defaultValue={property.landmark || ""} />
            </div>
            <div>
              <label className={labelClass}>Pin Code</label>
              <input name="pinCode" type="text" className={inputClass} defaultValue={property.pinCode || ""} />
            </div>
          </div>
          <div className="mb-6">
            <label className={labelClass}>Address</label>
            <textarea
              name="address"
              rows={4}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClass}>City*</label>
              <select name="city" required className={inputClass} defaultValue={property.city || ""}>
                <option value="" disabled hidden>City</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Miami">Miami</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Location*</label>
              <select name="location" required className={inputClass} defaultValue={property.location || ""}>
                <option value="" disabled hidden>Location</option>
                <option value="Downtown">Downtown</option>
                <option value="Suburb">Suburb</option>
                <option value="Uptown">Uptown</option>
                <option value="Bandstand">Bandstand</option>
                <option value={property.location}>{property.location}</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── PROPERTY DESCRIPTION ─────────────────────────────────── */}
        <div className="mb-8">
          <h2 className={sectionHeaderClass}>
            <span className="text-gray-900 mr-2">PROPERTY</span> DESCRIPTION
          </h2>
          <div className="space-y-6">
            <div>
              <textarea
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={8}
                className={`${inputClass} resize-y`}
                placeholder="Detailed Information"
                required
              />
            </div>
            <div>
              <label className={labelClass}>Amenities</label>
              <select name="features" className={inputClass} defaultValue={property.features || ""}>
                <option value="" disabled hidden>Nothing selected</option>
                <option value="Pool, Gym">Pool, Gym</option>
                <option value="Parking, Security">Parking, Security</option>
                <option value="Garden, Balcony">Garden, Balcony</option>
                <option value="All Amenities">All Amenities</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Youtube URL</label>
              <input name="youtubeUrl" type="text" className={inputClass} defaultValue={property.youtubeUrl || ""} />
            </div>
          </div>
        </div>

        {/* ── IMAGES ───────────────────────────────────────────────── */}
        <div className="mb-12">
          <h2 className={sectionHeaderClass}>
            <span className="text-gray-900 mr-2">PROPERTY</span> IMAGES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Thumbnail */}
            <div>
              <p className={labelClass}>Thumbnail Image</p>
              <p className="text-[11px] text-gray-400 mb-3">
                Leave unchanged to keep the existing thumbnail.
              </p>
              <div
                onClick={() => thumbnailRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleThumbnail(f); }}
                className="relative border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-white overflow-hidden"
                style={{ minHeight: 200 }}
              >
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-[200px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Click to change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                    <UploadCloud size={36} className="mb-3 text-gray-300" />
                    <p className="text-sm font-medium">Click or drag to upload</p>
                  </div>
                )}
              </div>
              <input
                ref={thumbnailRef}
                name="thumbnail"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { if (e.target.files?.[0]) handleThumbnail(e.target.files[0]); }}
              />
            </div>

            {/* Gallery */}
            <div>
              <p className={labelClass}>Gallery Images <span className="text-gray-400 font-normal">(max 10)</span></p>
              <p className="text-[11px] text-gray-400 mb-3">Existing images shown below. Remove or add new ones.</p>

              {/* Existing gallery thumbnails */}
              {existingGalleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {existingGalleryUrls.map((src, idx) => (
                    <div key={src} className="relative group aspect-square">
                      <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover rounded border border-gray-200" />
                      <button
                        type="button"
                        onClick={() => removeExistingGallery(idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New gallery upload area */}
              {totalGallery < 10 && (
                <div
                  onClick={() => galleryRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) handleGallery(e.dataTransfer.files); }}
                  className="border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-white p-4"
                  style={{ minHeight: 120 }}
                >
                  {galleryPreviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[88px] text-gray-400">
                      <ImageIcon size={28} className="mb-2 text-gray-300" />
                      <p className="text-sm font-medium">Add more images</p>
                      <p className="text-xs mt-1">Up to {10 - existingGalleryUrls.length} more</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {galleryPreviews.map((src, idx) => (
                        <div key={idx} className="relative group aspect-square">
                          <img src={src} alt={`New ${idx + 1}`} className="w-full h-full object-cover rounded" />
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); removeNewGallery(idx); }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-[11px] text-gray-400 mt-2">{totalGallery}/10 images</p>
              <input
                ref={galleryRef}
                name="gallery"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => { if (e.target.files) handleGallery(e.target.files); }}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-12 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#FF0000] text-white font-bold text-[13px] uppercase tracking-wider py-3.5 px-8 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors rounded-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "SAVING..." : "SAVE CHANGES"}
          </button>
          <Link
            href="/admin"
            className="py-3.5 px-8 border border-gray-300 text-gray-600 font-bold text-[13px] uppercase tracking-wider hover:bg-gray-50 transition-colors rounded-sm"
          >
            CANCEL
          </Link>
        </div>
      </form>
    </div>
  );
}

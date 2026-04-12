"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [amenities, setAmenities] = useState("");

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  // Gallery state (max 10)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleThumbnail = (file: File) => {
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleGallery = (files: FileList) => {
    const incoming = Array.from(files);
    const combined = [...galleryFiles, ...incoming].slice(0, 10);
    setGalleryFiles(combined);
    setGalleryPreviews(combined.map(f => URL.createObjectURL(f)));
  };

  const removeGallery = (idx: number) => {
    const updated = galleryFiles.filter((_, i) => i !== idx);
    setGalleryFiles(updated);
    setGalleryPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  // Custom submit — sends multipart/form-data via fetch
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Replace the hidden gallery input with actual File objects
    fd.delete("gallery");
    galleryFiles.forEach(f => fd.append("gallery", f));

    try {
      const res = await fetch("/api/properties/create", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelClass = "block text-[13px] text-gray-500 mb-1.5 font-medium";
  const inputClass = "w-full border border-gray-200 rounded text-sm px-3 py-2 text-gray-700 focus:outline-none focus:border-gray-400 bg-white placeholder-gray-400";
  const sectionHeaderClass = "text-xs font-bold text-gray-700 tracking-wider mb-6 flex items-center";

  return (
    <div className="max-w-6xl mx-auto py-8">
      <form onSubmit={handleSubmit} className="bg-[#fafafa] p-8 md:p-12 border border-gray-100 rounded-sm">
        
        {/* ======================= PROPERTY INFORMATION ======================= */}
        <div className="mb-12">
          <h2 className={sectionHeaderClass}>
            <span className="text-gray-900 mr-2">PROPERTY</span> INFORMATION
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <div>
              <label className={labelClass}>Status*</label>
              <select name="status" required className={inputClass} defaultValue="">
                <option value="" disabled hidden>Select</option>
                <option value="Active">Active</option>
                <option value="Sold">Sold</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Type*</label>
              <select name="propertyType" required className={inputClass} defaultValue="">
                <option value="" disabled hidden>Select</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Price*</label>
              <input name="price" type="number" required className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Area (Sq.ft)*</label>
              <input name="area" type="number" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Plot Area (Sq.ft)</label>
              <input name="plotArea" type="number" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Bedroom</label>
              <select name="bedrooms" className={inputClass} defaultValue="">
                <option value="" disabled hidden>Select</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Transaction</label>
              <select name="transaction" className={inputClass} defaultValue="">
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
              <select name="furnishing" className={inputClass} defaultValue="">
                <option value="" disabled hidden>Select</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="UnFurnished">UnFurnished</option>
                <option value="Semi Furnished">Semi Furnished</option>
                <option value="Ready to Furnished">Ready to Furnished</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Property Age</label>
              <select name="propertyAge" className={inputClass} defaultValue="">
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

        {/* ======================= LOCATION INFORMATION ======================= */}
        <div className="mb-12">
          <h2 className={sectionHeaderClass}>
            <span className="text-gray-900 mr-2">LOCATION</span> INFORMATION
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-6">
            <div>
              <label className={labelClass}>Flat No./Unit No.</label>
              <input name="flatUnitNo" type="text" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Property Name</label>
              <input name="title" type="text" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Building Name</label>
              <input name="buildingName" type="text" className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Street</label>
              <input name="street" type="text" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Landmark</label>
              <input name="landmark" type="text" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pin Code</label>
              <input name="pinCode" type="text" className={inputClass} />
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
              <select name="city" required className={inputClass} defaultValue="">
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
              <select name="location" required className={inputClass} defaultValue="">
                <option value="" disabled hidden>Location</option>
                <option value="Downtown">Downtown</option>
                <option value="Suburb">Suburb</option>
                <option value="Uptown">Uptown</option>
                <option value="Bandstand">Bandstand</option>
              </select>
            </div>
          </div>
        </div>

        {/* ======================= PROPERTY DESCRIPTION ======================= */}
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
              <select name="features" className={inputClass} defaultValue="">
                <option value="" disabled hidden>Nothing selected</option>
                <option value="Pool, Gym">Pool, Gym</option>
                <option value="Parking, Security">Parking, Security</option>
                <option value="Garden, Balcony">Garden, Balcony</option>
                <option value="All Amenities">All Amenities</option>
              </select>
            </div>
            
            <div>
              <label className={labelClass}>Youtube Url</label>
              <input name="youtubeUrl" type="text" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ======================= IMAGES ======================= */}
        <div className="mb-12">
          <h2 className={sectionHeaderClass}>
            <span className="text-gray-900 mr-2">PROPERTY</span> IMAGES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Thumbnail */}
            <div>
              <p className={labelClass}>Thumbnail Image <span className="text-red-500">*</span></p>
              <p className="text-[11px] text-gray-400 mb-3">This image will be shown on the property listing card on the home page.</p>
              <div
                onClick={() => thumbnailRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleThumbnail(f); }}
                className="relative border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-white overflow-hidden"
                style={{ minHeight: 200 }}
              >
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-[200px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium">Click to change</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                    <UploadCloud size={36} className="mb-3 text-gray-300" />
                    <p className="text-sm font-medium">Click or drag to upload thumbnail</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP</p>
                  </div>
                )}
              </div>
              {/* Hidden actual input */}
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
              <p className="text-[11px] text-gray-400 mb-3">These images will be visible when a visitor clicks on the property listing.</p>
              <div
                onClick={() => galleryFiles.length < 10 && galleryRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) handleGallery(e.dataTransfer.files); }}
                className="border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-white p-4"
                style={{ minHeight: 200 }}
              >
                {galleryPreviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[168px] text-gray-400">
                    <ImageIcon size={36} className="mb-3 text-gray-300" />
                    <p className="text-sm font-medium">Click or drag to upload gallery</p>
                    <p className="text-xs mt-1">Up to 10 images • PNG, JPG, WEBP</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryPreviews.map((src, idx) => (
                      <div key={idx} className="relative group aspect-square">
                        <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover rounded" />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); removeGallery(idx); }}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {galleryFiles.length < 10 && (
                      <div className="aspect-square border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-300 hover:border-blue-300 transition-colors">
                        <UploadCloud size={20} />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2">{galleryFiles.length}/10 images added</p>
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

        <div className="mt-12">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#FF0000] text-white font-bold text-[13px] uppercase tracking-wider py-3.5 px-8 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors rounded-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "SAVING..." : "SUBMIT"}
          </button>
        </div>
        
      </form>
    </div>
  );
}

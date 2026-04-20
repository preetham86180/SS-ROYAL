"use client";

import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { UploadCloud, X, Image as ImageIcon, Loader2, CheckCircle } from "lucide-react";

export default function SubmitPropertyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  // Thumbnail state
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);

  // Gallery state (max 5)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleThumbnail = (file: File) => {
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleGallery = (files: FileList) => {
    const incoming = Array.from(files);
    // Limit to 5 extra photos
    const combined = [...galleryFiles, ...incoming].slice(0, 5);
    setGalleryFiles(combined);
    setGalleryPreviews(combined.map(f => URL.createObjectURL(f)));
  };

  const removeGallery = (idx: number) => {
    const updated = galleryFiles.filter((_, i) => i !== idx);
    setGalleryFiles(updated);
    setGalleryPreviews(updated.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!thumbnail) {
      alert("A thumbnail image is required.");
      return;
    }

    setIsSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    fd.delete("gallery");
    galleryFiles.forEach(f => fd.append("gallery", f));

    try {
      const res = await fetch("/api/properties/submit", {
        method: "POST",
        body: fd,
      });
      if (res.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const sectionHeaderClass = "text-[13px] font-bold text-gray-700 tracking-wider mb-6 flex items-center uppercase";

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-[#FDFDFD] pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4">
          
          {isSuccess ? (
            <div className="bg-white border border-green-200 p-12 text-center rounded-lg shadow-sm">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Submitted Successfully!</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Thank you for submitting your property. Our admin team will review it shortly. Once approved, it will be listed on SS Royal Properties.</p>
              <a href="/properties" className="bg-[#0B1120] text-white px-8 py-3 rounded text-sm font-semibold hover:bg-gray-800 transition-colors">
                Back to Properties
              </a>
            </div>
          ) : (
            <div className="bg-white p-8 md:p-12 border border-gray-100 rounded shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              
              <div className="mb-10 text-center border-b border-gray-100 pb-8">
                <h1 className="text-2xl font-display font-bold text-gray-900">List Your Property</h1>
                <p className="text-gray-500 mt-2 text-sm">Fill out the details below to submit your property to our platform.</p>
              </div>

              <form onSubmit={handleSubmit}>
                
                {/* ── PERSONAL INFO ── */}
                <div className="mb-12">
                  <h2 className={sectionHeaderClass}>
                    <span className="text-gray-900 font-bold mr-1.5">PERSONAL</span> INFORMATION
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <div>
                      <label className={labelClass}>Owner Form / Name*</label>
                      <input name="ownerName" type="text" required className={inputClass} placeholder="Your Full Name" />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address*</label>
                      <input name="ownerEmail" type="email" required className={inputClass} placeholder="you@example.com" />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number*</label>
                      <input name="ownerPhone" type="tel" required className={inputClass} placeholder="+91 9999999999" />
                    </div>
                  </div>
                </div>

                {/* ── PROPERTY INFORMATION ── */}
                <div className="mb-12 border-t border-gray-100 pt-10">
                  <h2 className={sectionHeaderClass}>
                    <span className="text-gray-900 font-bold mr-1.5">PROPERTY</span> INFORMATION
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
                        <option value="Plot">Plot</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Price (₹)*</label>
                      <input name="price" type="number" required className={inputClass} placeholder="Eg: 15000000" />
                    </div>

                    <div>
                      <label className={labelClass}>Area (Sq.ft)*</label>
                      <input name="area" type="number" required className={inputClass} placeholder="Built-up Area" />
                    </div>
                    <div>
                      <label className={labelClass}>Plot Area (Sq.ft)</label>
                      <input name="plotArea" type="number" className={inputClass} placeholder="Plot Area (if any)" />
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
                        <option value="Pre Lease/ Pre Rented">Pre Lease</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Furnishing</label>
                      <select name="furnishing" className={inputClass} defaultValue="">
                        <option value="" disabled hidden>Select</option>
                        <option value="Fully Furnished">Fully Furnished</option>
                        <option value="Semi Furnished">Semi Furnished</option>
                        <option value="UnFurnished">UnFurnished</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Property Age</label>
                      <select name="propertyAge" className={inputClass} defaultValue="">
                        <option value="" disabled hidden>Select</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="New">New</option>
                        <option value="Less than 5 years">Less than 5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10-20 years">10-20 years</option>
                        <option value="More than 20 years">More than 20 years</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── LOCATION INFORMATION ── */}
                <div className="mb-12 border-t border-gray-100 pt-10">
                  <h2 className={sectionHeaderClass}>
                    <span className="text-gray-900 font-bold mr-1.5">LOCATION</span> INFORMATION
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-6">
                    <div><label className={labelClass}>Flat No./Unit No.</label><input name="flatUnitNo" type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>Property Name / Title</label><input name="title" type="text" required className={inputClass} placeholder="Title for listing" /></div>
                    <div><label className={labelClass}>Building Name</label><input name="buildingName" type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>Street</label><input name="street" type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>Landmark</label><input name="landmark" type="text" className={inputClass} /></div>
                    <div><label className={labelClass}>Pin Code</label><input name="pinCode" type="text" className={inputClass} /></div>
                  </div>
                  <div className="mb-6">
                    <label className={labelClass}>Address</label>
                    <textarea name="address" rows={3} value={address} onChange={e => setAddress(e.target.value)} className={`${inputClass} resize-y`} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass}>City*</label>
                      <input name="city" type="text" required className={inputClass} placeholder="City name" />
                    </div>
                    <div>
                      <label className={labelClass}>Location Area*</label>
                      <input name="location" type="text" required className={inputClass} placeholder="Neighbourhood / Area" />
                    </div>
                  </div>
                </div>

                {/* ── PROPERTY DESCRIPTION ── */}
                <div className="mb-12 border-t border-gray-100 pt-10">
                  <h2 className={sectionHeaderClass}>
                    <span className="text-gray-900 font-bold mr-1.5">PROPERTY</span> DESCRIPTION
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <textarea name="description" value={description} onChange={e => setDescription(e.target.value)} rows={6} required className={`${inputClass} resize-y`} placeholder="Detailed Information about the property..."/>
                    </div>
                    <div>
                      <label className={labelClass}>Amenities (Optional)</label>
                      <input name="features" type="text" className={inputClass} placeholder="e.g. Pool, Gym, Parking, Security (comma separated)" />
                    </div>
                    <div>
                      <label className={labelClass}>Youtube Video URL</label>
                      <input name="youtubeUrl" type="text" className={inputClass} placeholder="https://youtube.com/watch?v=..." />
                    </div>
                  </div>
                </div>

                {/* ── IMAGES ── */}
                <div className="mb-12 border-t border-gray-100 pt-10">
                  <h2 className={sectionHeaderClass}>
                    <span className="text-gray-900 font-bold mr-1.5">PROPERTY</span> IMAGES
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Thumbnail */}
                    <div>
                      <p className={labelClass}>Thumbnail Image <span className="text-red-500">*</span></p>
                      <p className="text-[11px] text-gray-400 mb-3">Main cover image for your property.</p>
                      <div
                        onClick={() => thumbnailRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleThumbnail(f); }}
                        className="relative border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-white overflow-hidden"
                        style={{ minHeight: 180 }}
                      >
                        {thumbnailPreview ? (
                          <>
                            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-[180px] object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <span className="text-white text-sm font-medium">Click to change</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[180px] text-gray-400">
                            <UploadCloud size={32} className="mb-2 text-gray-300" />
                            <p className="text-sm font-medium text-gray-500">Upload thumbnail</p>
                          </div>
                        )}
                      </div>
                      <input ref={thumbnailRef} name="thumbnail" type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleThumbnail(e.target.files[0]); }} />
                    </div>

                    {/* Gallery */}
                    <div>
                      <p className={labelClass}>Extra Photos <span className="text-gray-400 font-normal">(max 5)</span></p>
                      <p className="text-[11px] text-gray-400 mb-3">Upload additional photos of the interior/exterior.</p>
                      <div
                        onClick={() => galleryFiles.length < 5 && galleryRef.current?.click()}
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => { e.preventDefault(); if (e.dataTransfer.files) handleGallery(e.dataTransfer.files); }}
                        className="border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-white p-4"
                        style={{ minHeight: 180 }}
                      >
                        {galleryPreviews.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-[148px] text-gray-400">
                            <ImageIcon size={32} className="mb-2 text-gray-300" />
                            <p className="text-sm font-medium text-gray-500">Add up to 5 photos</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {galleryPreviews.map((src, idx) => (
                              <div key={idx} className="relative group aspect-square">
                                <img src={src} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover rounded" />
                                <button type="button" onClick={e => { e.stopPropagation(); removeGallery(idx); }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                            {galleryFiles.length < 5 && (
                              <div className="aspect-square border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-300 hover:border-blue-300 transition-colors">
                                <UploadCloud size={20} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">{galleryFiles.length}/5 images added</p>
                      <input ref={galleryRef} name="gallery" type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files) handleGallery(e.target.files); }} />
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-start">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#FF0000] text-white font-bold text-[13px] uppercase tracking-wider py-3 px-10 flex items-center justify-center gap-2 hover:bg-red-700 transition-colors rounded-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SocialCard } from "@/components/SocialCard";
import { ReelsCarousel, Reel } from "@/components/ReelsCarousel";

export default async function BlogPage() {
  const socialLinks = [
    {
      platform: "Facebook",
      followers: "20.5K followers",
      buttonText: "Follow Me",
      url: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1877F2" stroke="none">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      platform: "Instagram",
      followers: "30.9K followers",
      buttonText: "Follow Me",
      url: "#",
      icon: (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </div>
      ),
    },
    {
      platform: "Tiktok",
      followers: "2.5M followers",
      buttonText: "Follow Me",
      url: "#",
      icon: (
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        </div>
      ),
    },
    {
      platform: "YouTube",
      followers: "1.69M Subscribers",
      buttonText: "Subscribe",
      url: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  // Fetch Instagram Reels directly on the server
  let reels: Reel[] = [];
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (token) {
    try {
      const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}`,
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );
      if (res.ok) {
        const data = await res.json();
        reels = data.data
          .filter((item: any) => item.media_type === "VIDEO")
          .map((item: any) => ({
            id: item.id,
            title: item.caption ? item.caption.substring(0, 50) + "..." : "Instagram Reel",
            thumbnail: item.thumbnail_url || item.media_url,
            videoUrl: item.media_url,
          }))
          .slice(0, 10);
      }
    } catch (e) {
      console.error("Failed to fetch Instagram reels:", e);
    }
  }

  // Fallback to mock data if no token or API fails
  if (reels.length === 0) {
    reels = [
      {
        id: "1",
        title: "Summer Collection",
        thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Real mp4 fallback
      },
      {
        id: "2",
        title: "Street Style",
        thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: "3",
        title: "Makeup Tutorial",
        thumbnail: "https://images.unsplash.com/photo-1529139574466-a303027c028c?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: "4",
        title: "Red Fashion",
        thumbnail: "https://images.unsplash.com/photo-1485230895905-ef40ba8abece?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: "5",
        title: "Outdoor Shoot",
        thumbnail: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ];
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 w-full bg-white pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Setup Warning for Admin */}
          {!token && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 text-sm font-medium flex items-center justify-center">
              <span>⚠️ <strong>Admin Note:</strong> The Instagram API is not connected yet. Showing placeholder reels. Please follow the setup instructions to add your INSTAGRAM_ACCESS_TOKEN to the .env file.</span>
            </div>
          )}

          {/* Social Links Row */}
          <section className="mb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialLinks.map((link) => (
                <SocialCard
                  key={link.platform}
                  platform={link.platform}
                  followers={link.followers}
                  buttonText={link.buttonText}
                  url={link.url}
                  icon={link.icon}
                />
              ))}
            </div>
          </section>

          {/* Video Reels Section */}
          <section>
            <ReelsCarousel reels={reels} />
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

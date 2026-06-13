import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Instagram Access Token is missing from environment variables." },
      { status: 400 }
    );
  }

  try {
    // Fetch user's media from Instagram Graph API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Instagram API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch data from Instagram API" },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filter to only include videos (Reels) and map to our frontend format
    const reels = data.data
      .filter((item: any) => item.media_type === "VIDEO")
      .map((item: any) => ({
        id: item.id,
        title: item.caption ? item.caption.substring(0, 50) + "..." : "Instagram Reel",
        thumbnail: item.thumbnail_url || item.media_url, // fallback to media_url if thumbnail is missing (rare for videos)
        videoUrl: item.media_url,
      }))
      .slice(0, 10); // Limit to latest 10 reels

    return NextResponse.json({ reels });
  } catch (error) {
    console.error("Error connecting to Instagram:", error);
    return NextResponse.json(
      { error: "Internal Server Error while fetching Instagram data" },
      { status: 500 }
    );
  }
}

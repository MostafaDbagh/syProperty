"use client";
import Image from "next/image";
import ModalVideo from "../common/ModalVideo";
import { useState } from "react";

export default function VideoReview({ property }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Extract video ID from URL if it's a YouTube URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const videoId = getYouTubeVideoId(property?.videoUrl);
  
  // Don't render the component if there's no video
  if (!videoId) {
    return null;
  }

  // Use first property image as thumbnail, or fallback to default
  const thumbnailImage = property?.images?.[0] || "/images/section/property-detail.jpg";

  return (
    <>
      <div className="wg-title text-11 fw-6 text-color-heading">Video</div>
      <div className="widget-video style-1">
        <Image
          className="lazyload"
          data-src={thumbnailImage}
          alt="Property Video Thumbnail"
          src={thumbnailImage}
          width={792}
          height={446}
        />
        <a onClick={() => setIsOpen(true)} className="popup-youtube">
          <i className="icon-play" />
        </a>
      </div>
      <ModalVideo
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        videoId={videoId}
      />
    </>
  );
}

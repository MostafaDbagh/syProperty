import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const title = `Property Details – Holiday Homes, Apartments & Villas | Syria`;
  const description =
    "Find the right property for sale or rent. Detailed specs, high-quality photos, and prime locations across Lattakia and Syria.";
  const url = `https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-detail-v5/${id}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [
        { url: "/images/section/property-grid-bg.jpg", width: 1200, height: 630, alt: "Property Details" },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/section/property-grid-bg.jpg"],
    },
  };
}

export default async function page({ params }) {
  const { id } = await params;

  return <PropertyDetailClient id={id} />;
}

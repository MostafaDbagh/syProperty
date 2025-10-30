import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const title = `Property Details – Houses & Apartments for Sale/Rent | Syria`;
  const description =
    "View photos, amenities, prices and locations for top properties and holiday homes in Lattakia and across Syria. Buy or rent with confidence.";
  const url = `https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-detail-v1/${id}`;
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

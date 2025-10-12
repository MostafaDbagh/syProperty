import Cta from "@/components/common/Cta";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import FilterTop from "@/components/properties/FilterTop";

import Properties4 from "@/components/properties/Properties4";
import React from "react";

export const metadata = {
  title: "Syria Property Grid with Filters - Lattakia Real Estate Listings",
  description: "Browse Syria and Lattakia property listings with advanced filters. Find your perfect home, apartment, or holiday rental with our comprehensive property search grid. Expert real estate guidance in Syria.",
  keywords: [
    'syria property grid',
    'lattakia property grid',
    'syria property filters',
    'lattakia property filters',
    'syria real estate listings',
    'lattakia real estate listings',
    'syria property search',
    'lattakia property search',
    'syria homes for sale',
    'lattakia homes for sale',
    'syria apartments for rent',
    'lattakia apartments for rent',
    'syria holiday homes',
    'lattakia holiday homes',
    'syria vacation rentals',
    'lattakia vacation rentals',
    'syria beach properties',
    'lattakia beach properties',
    'syria coastal homes',
    'lattakia coastal homes'
  ],
  openGraph: {
    title: "Syria Property Grid with Filters - Lattakia Real Estate Listings",
    description: "Browse Syria and Lattakia property listings with advanced filters. Find your perfect home, apartment, or holiday rental with our comprehensive property search grid.",
    url: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-gird-left-sidebar',
    images: [
      {
        url: '/images/section/property-grid-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Syria Property Grid with Filters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Syria Property Grid with Filters - Lattakia Real Estate Listings",
    description: "Browse Syria and Lattakia property listings with advanced filters. Find your perfect home, apartment, or holiday rental.",
    images: ['/images/section/property-grid-bg.jpg'],
  },
  alternates: {
    canonical: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-gird-left-sidebar',
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <FilterTop />
        <div className="main-content">
          <Properties4 defaultGrid />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

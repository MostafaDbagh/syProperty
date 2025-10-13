import Cta from "@/components/common/Cta";

import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import FilterTop from "@/components/properties/FilterTop";

import Properties3 from "@/components/properties/Properties3";
import React from "react";

export const metadata = {
  title: "Syria Property Search with Right Filters - Lattakia Real Estate",
  description: "Advanced property search for Syria and Lattakia with right sidebar filters. Find homes, apartments, and holiday rentals with detailed search options. Premium real estate service in Syria.",
  keywords: [
    'syria property search',
    'lattakia property search',
    'syria property filters',
    'lattakia property filters',
    'syria real estate search',
    'lattakia real estate search',
    'syria property sidebar',
    'lattakia property sidebar',
    'syria homes search',
    'lattakia homes search',
    'syria apartments search',
    'lattakia apartments search',
    'syria property finder',
    'lattakia property finder',
    'syria property browser',
    'lattakia property browser',
    'syria real estate finder',
    'lattakia real estate finder'
  ],
  openGraph: {
    title: "Syria Property Search with Right Filters - Lattakia Real Estate",
    description: "Advanced property search for Syria and Lattakia with right sidebar filters. Find homes, apartments, and holiday rentals with detailed search options.",
    url: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-gird-right-sidebar',
    images: [
      {
        url: '/images/section/property-search-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Syria Property Search with Filters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Syria Property Search with Right Filters - Lattakia Real Estate",
    description: "Advanced property search for Syria and Lattakia with right sidebar filters. Find homes, apartments, and holiday rentals.",
    images: ['/images/section/property-search-bg.jpg'],
  },
  alternates: {
    canonical: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/property-gird-right-sidebar',
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <FilterTop />
        <div className="main-content">
          <Properties3 defaultGrid />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

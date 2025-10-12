import Agents from "@/components/agents/Agents";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import React from "react";

export const metadata = {
  title: "Syria & Lattakia Real Estate Agents - Expert Property Professionals",
  description: "Meet our team of experienced real estate agents and property professionals in Syria and Lattakia. Get personalized guidance for buying, selling, or renting properties with expert local market knowledge.",
  keywords: [
    'syria real estate agents',
    'lattakia real estate agents',
    'syria property professionals',
    'lattakia property professionals',
    'syria real estate team',
    'lattakia real estate team',
    'syria property experts',
    'lattakia property experts',
    'syria real estate consultants',
    'lattakia real estate consultants',
    'local syria real estate agents',
    'local lattakia real estate agents',
    'syria property advisors',
    'lattakia property advisors',
    'syria real estate specialists',
    'lattakia real estate specialists',
    'syria holiday homes agents',
    'lattakia holiday homes agents',
    'syria vacation rental specialists',
    'lattakia vacation rental specialists',
    'syria beach property experts',
    'lattakia beach property experts',
    'syria coastal property advisors',
    'lattakia coastal property advisors'
  ],
  openGraph: {
    title: "Syria & Lattakia Real Estate Agents - Expert Property Professionals",
    description: "Meet our team of experienced real estate agents and property professionals in Syria and Lattakia. Get personalized guidance for all your property needs.",
    url: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/agents',
    images: [
      {
        url: '/images/section/agents-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Real Estate Agents',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Real Estate Agents - Meet Our Expert Property Professionals",
    description: "Meet our team of experienced real estate agents and property professionals. Get personalized guidance for all your property needs.",
    images: ['/images/section/agents-bg.jpg'],
  },
  alternates: {
    canonical: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/agents',
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="page-content">
          <Breadcumb pageName="Agents" />
          <Agents />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

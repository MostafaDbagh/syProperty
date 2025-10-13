import Agency1 from "@/components/agency/Agency1";
import Agents from "@/components/agents/Agents";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import React from "react";

export const metadata = {
  title: "Syria Real Estate Agencies - Top Lattakia Property Agencies",
  description: "Discover the top real estate agencies in Syria and Lattakia. Professional property agencies offering premium homes, apartments, and commercial properties. Trusted real estate partners in Syria.",
  keywords: [
    'syria real estate agencies',
    'lattakia real estate agencies',
    'syria property agencies',
    'lattakia property agencies',
    'syria real estate companies',
    'lattakia real estate companies',
    'syria property companies',
    'lattakia property companies',
    'syria real estate firms',
    'lattakia real estate firms',
    'syria property firms',
    'lattakia property firms',
    'syria real estate brokers',
    'lattakia real estate brokers',
    'syria property brokers',
    'lattakia property brokers',
    'syria real estate services',
    'lattakia real estate services',
    'syria property services',
    'lattakia property services'
  ],
  openGraph: {
    title: "Syria Real Estate Agencies - Top Lattakia Property Agencies",
    description: "Discover the top real estate agencies in Syria and Lattakia. Professional property agencies offering premium homes, apartments, and commercial properties.",
    url: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/agency-grid',
    images: [
      {
        url: '/images/section/agency-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Syria Real Estate Agencies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Syria Real Estate Agencies - Top Lattakia Property Agencies",
    description: "Discover the top real estate agencies in Syria and Lattakia. Professional property agencies offering premium homes, apartments, and commercial properties.",
    images: ['/images/section/agency-bg.jpg'],
  },
  alternates: {
    canonical: 'https://proty-frontend-mostafa-4a0069a6dba8.herokuapp.com/agency-grid',
  },
};
export default function page() {
  return (
    <>
      <div id="wrapper">
        <Header1 />
        <div className="main-content tf-spacing-4">
          <Breadcumb pageName="Agency Grid" />
          <Agency1 />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

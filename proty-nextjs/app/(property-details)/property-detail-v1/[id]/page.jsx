import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Details1 from "@/components/propertyDetails/Details1";
import RelatedProperties from "@/components/propertyDetails/RelatedProperties";
import Slider1 from "@/components/propertyDetails/sliders/Slider1";
import React from "react";
import { listingAPI } from "@/apis";

export const metadata = {
  title: "Property Details 01 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};

export default async function page({ params }) {
  const { id } = await params;

  let property = null;
  let error = null;

  try {
    // Fetch property from API
    property = await listingAPI.getListingById(id);
  } catch (err) {
    console.error('Error fetching property:', err);
    error = err.message;
    // Fallback to static data if API fails
    const { allProperties } = await import("@/data/properties");
    property = allProperties.filter((elm) => elm.id == id)[0] || allProperties[0];
  }

  if (!property && error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Property</h4>
          <p>{error}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="wrapper">
        <Header1 />
        <Breadcumb pageName="Property Details 01" />
        <div className="main-content">
          <Slider1 property={property} />
          <Details1 property={property} />
          <RelatedProperties />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

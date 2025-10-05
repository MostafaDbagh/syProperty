"use client";
import React from "react";
import { useListing } from "@/apis/hooks";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Details1 from "@/components/propertyDetails/Details1";
import RelatedProperties from "@/components/propertyDetails/RelatedProperties";
import Slider1 from "@/components/propertyDetails/sliders/Slider1";

export default function PropertyDetailClient({ id }) {
  const { data: property, isLoading, isError, error } = useListing(id);

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error Loading Property</h4>
          <p>{error?.message || 'Failed to load property details'}</p>
          <p>Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Property Not Found</h4>
          <p>The property you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="wrapper">
        <Header1 />
        <Breadcumb pageName="Property Details" />
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

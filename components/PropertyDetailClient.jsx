"use client";
import React from "react";
import { useListing } from "@/apis/hooks";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Breadcumb from "@/components/common/Breadcumb";
import Cta from "@/components/common/Cta";
import Details3 from "@/components/propertyDetails/Details3";
import PropertyReviews from "@/components/propertyDetails/PropertyReviews";
import RelatedProperties from "@/components/propertyDetails/RelatedProperties";
import LocationLoader from "@/components/common/LocationLoader";

export default function PropertyDetailClient({ id }) {
  const { data: property, isLoading, isError, error } = useListing(id);

  // Removed automatic visit count increment - now only called on user actions

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <LocationLoader />
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
          <Details3 property={property} />
          <RelatedProperties currentProperty={property} />
          <Cta />
        </div>
        <Footer1 />
      </div>
    </>
  );
}

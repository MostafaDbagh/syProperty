import React from "react";
import { formatPrice, formatStatus } from "@/utlis/propertyHelpers";

export default function ExtraInfo({ property }) {
  // Get description or show default
  const description = property?.propertyDesc || 'No description available for this property.';

  return (
    <>
      <div className="wg-title text-11 fw-6 text-color-heading">
        Property Details
      </div>
      <div className="content">
        <p className="description text-1">
          {description}
        </p>
      </div>
      <div className="box">
        <ul>
          <li className="flex">
            <p className="fw-6">ID</p>
            <p>#{property?.propertyId || 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Price</p>
            <p>{formatPrice(property?.propertyPrice)}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Size</p>
            <p>{property?.size || '0'} sqft</p>
          </li>
          <li className="flex">
            <p className="fw-6">Bedrooms</p>
            <p>{property?.bedrooms || '0'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Bathrooms</p>
            <p>{property?.bathrooms || '0'}</p>
          </li>
        </ul>
        <ul>
          <li className="flex">
            <p className="fw-6">Land Area</p>
            <p>{property?.landArea ? `${property.landArea} sqft` : 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Year Built</p>
            <p>{property?.yearBuilt || 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Type</p>
            <p>{property?.propertyType || 'N/A'}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Status</p>
            <p>{formatStatus(property?.status)}</p>
          </li>
          <li className="flex">
            <p className="fw-6">Garage</p>
            <p>{property?.garages ? `Yes (${property?.garageSize || '0'} sqft)` : 'No'}</p>
          </li>
        </ul>
      </div>
    </>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FavoriteButton from "../common/FavoriteButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import "./PropertyImageFix.css";

export default function PropertyListItems({ listings = [] }) {
  const { handleDetailsClick, handleQuickViewClick } = usePropertyActions();
  if (!listings || listings.length === 0) {
    return (
      <div className="empty-state-container">
        <p>No properties found matching your criteria.</p>
      </div>
    );
  }

  // Debug: Log the first property to see the data structure
  if (listings.length > 0) {
    console.log('PropertyListItems - First property data:', listings[0]);
    console.log('PropertyListItems - Images:', listings[0].images);
    console.log('PropertyListItems - ImageNames:', listings[0].imageNames);
    console.log('PropertyListItems - All keys:', Object.keys(listings[0]));
  }

  // Function to get image source
  const getImageSource = (property) => {
    console.log('Getting image source for property:', property.propertyTitle);
    
    // Try different possible image sources
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      console.log('First image object:', firstImage);
      
      if (typeof firstImage === 'string') {
        console.log('Image is string:', firstImage);
        return firstImage;
      } else if (firstImage && firstImage.url) {
        console.log('Image URL:', firstImage.url);
        return firstImage.url;
      }
    }
    
    // Try imageNames as fallback
    if (property.imageNames && property.imageNames.length > 0) {
      console.log('Using imageNames:', property.imageNames[0]);
      return property.imageNames[0];
    }
    
    console.log('Using default image');
    return "/images/section/box-house-2.jpg";
  };

  return (
    <>
      <style jsx>{`
        .empty-state-container {
          grid-column: 1 / -1 !important;
          text-align: center !important;
          padding: 40px !important;
          color: #666 !important;
        }
        
        .property-img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          display: block !important;
        }
        
        .holiday-badge {
          background: linear-gradient(135deg, #FF6B6B, #FF8E8E) !important;
          border: 2px solid #FF4757 !important;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3) !important;
        }
        
        .details-btn-bordered {
          background: none !important;
          border: 1px solid #F97316 !important;
          color: #F97316 !important;
          cursor: pointer !important;
        }
      `}</style>
      {listings.map((property, i) => (
        <div key={i} className="box-house style-list hover-img property-list-image-fix">
          <div className="image-wrap">
            <Link href={`/property-detail/${property._id}`}>
              <Image
                className="lazyload property-img"
                alt={property.propertyKeyword || property.propertyTitle || 'Property'}
                src={getImageSource(property)}
                width={600}
                height={401}
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = "/images/section/box-house-2.jpg";
                }}
              />
            </Link>
            <ul className="box-tag flex gap-8">
              {property.propertyType === 'Holiday Homes' && (
                <li className="flat-tag text-4 fw-6 text_white holiday-badge">
                  🏖️ Holiday Home
                </li>
              )}
              {property.offer && (
                <li className="flat-tag text-4 bg-main fw-6 text_white">
                  Special Offer
                </li>
              )}
              <li className="flat-tag text-4 bg-3 fw-6 text_white">
                {property.status || 'Available'}
              </li>
            </ul>
            <div className="list-btn flex gap-8">
              <FavoriteButton 
                propertyId={property._id}
                showLabel={true}
              />
            </div>
          </div>
          <div className="content">
            <h5 className="title">
              <Link href={`/property-detail/${property._id}`}>
                {property.propertyTitle || property.propertyKeyword || 'Property'}
              </Link>
            </h5>
            <p className="location text-1 flex items-center gap-6">
              <i className="icon-location" /> {property.state || property.location || 'Location not specified'}
            </p>
            <ul className="meta-list flex">
              <li className="text-1 flex">
                <span>{property.bedrooms || 0}</span>Beds
              </li>
              <li className="text-1 flex">
                <span>{property.bathrooms || 0}</span>Baths
              </li>
              <li className="text-1 flex">
                <span>{property.size || 0}</span>Sqft
              </li>
            </ul>
            <div className="bot flex justify-between items-center">
              <div>
                <h5 className="price">${property.propertyPrice?.toLocaleString() || '0'}</h5>
                
              </div>
              <div className="wrap-btn flex">
                <button
                  onClick={() => handleDetailsClick(property._id)}
                  className="tf-btn style-border pd-4 details-btn-bordered"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

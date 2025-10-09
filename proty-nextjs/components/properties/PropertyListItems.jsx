"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FavoriteButton from "../common/FavoriteButton";
import "./PropertyImageFix.css";

export default function PropertyListItems({ listings = [] }) {
  if (!listings || listings.length === 0) {
    return (
      <div style={{ 
        gridColumn: '1 / -1', 
        textAlign: 'center', 
        padding: '40px',
        color: '#666'
      }}>
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
    return "/images/section/box-house-1.jpg";
  };

  return (
    <>
      {listings.map((property, i) => (
        <div key={i} className="box-house style-list hover-img property-list-image-fix">
          <div className="image-wrap">
            <Link href={`/property-detail/${property._id}`}>
              <Image
                className="lazyload"
                alt={property.propertyKeyword || property.propertyTitle || 'Property'}
                src={getImageSource(property)}
                width={600}
                height={401}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }}
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = "/images/section/box-house-1.jpg";
                }}
              />
            </Link>
            <ul className="box-tag flex gap-8">
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
              <a href="#" className="btn-icon find hover-tooltip">
                <i className="icon-find-plus" />
                <span className="tooltip">Quick View</span>
              </a>
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
              <h5 className="price">${property.propertyPrice?.toLocaleString() || '0'}</h5>
              <div className="wrap-btn flex">
                <Link
                  href={`/property-detail/${property._id}`}
                  className="tf-btn style-border pd-4"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

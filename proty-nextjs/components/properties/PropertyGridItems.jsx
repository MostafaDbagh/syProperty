"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FavoriteButton from "../common/FavoriteButton";
import "./PropertyImageFix.css";

export default function PropertyGridItems({ listings = [] }) {
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
    console.log('PropertyGridItems - First property data:', listings[0]);
    console.log('PropertyGridItems - Images:', listings[0].images);
    console.log('PropertyGridItems - ImageNames:', listings[0].imageNames);
    console.log('PropertyGridItems - All keys:', Object.keys(listings[0]));
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
      {listings.map((property) => (
        <div className="box-house hover-img property-image-fix" key={property._id}>
          <div className="image-wrap">
            <Link href={`/property-detail/${property._id}`}>
              <Image
                className="lazyload"
                alt={property.propertyKeyword || property.propertyTitle || 'Property'}
                src={getImageSource(property)}
                width={339}
                height={245}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#f5f5f5',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                color: '#999',
                fontSize: '14px'
              }}>
                No Image
              </div>
            </Link>
            <ul className="box-tag flex gap-8">
              {property.propertyType === 'Holiday Homes' && (
                <li className="flat-tag text-4 fw-6 text_white" style={{
                  background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                  border: '2px solid #FF4757',
                  boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                }}>
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
                <a href="#" className="compare flex gap-8 items-center text-1">
                  <i className="icon-compare" />
                  Compare
                </a>
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

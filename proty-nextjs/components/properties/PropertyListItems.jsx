"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import FavoriteButton from "../common/FavoriteButton";
import { usePropertyActions } from "@/hooks/usePropertyActions";
import "./PropertyImageFix.css";
import logger from "@/utils/logger";

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
    logger.debug('PropertyListItems - First property data:', listings[0]);
    logger.debug('PropertyListItems - Images:', listings[0].images);
    logger.debug('PropertyListItems - ImageNames:', listings[0].imageNames);
    logger.debug('PropertyListItems - All keys:', Object.keys(listings[0]));
  }

  // Function to get image source
  const getImageSource = (property) => {
    logger.debug('Getting image source for property:', property.propertyTitle);
    
    // Try different possible image sources
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      logger.debug('First image object:', firstImage);
      
      if (typeof firstImage === 'string') {
        logger.debug('Image is string:', firstImage);
        return firstImage;
      } else if (firstImage && firstImage.url) {
        logger.debug('Image URL:', firstImage.url);
        return firstImage.url;
      }
    }
    
    // Try imageNames as fallback
    if (property.imageNames && property.imageNames.length > 0) {
      logger.debug('Using imageNames:', property.imageNames[0]);
      return property.imageNames[0];
    }
    
    logger.debug('Using default image');
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
          max-width: 100% !important;
          height: 100% !important;
          max-height: 300px !important;
          min-height: 300px !important;
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
                  logger.warn('Image failed to load:', e.target.src);
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
              <li 
                className="flat-tag text-4 fw-6 text_white"
                style={{
                  backgroundColor: property.status?.toLowerCase() === 'rent' ? '#3B82F6' : '#10B981',
                  color: 'white'
                }}
              >
                {property.status?.toLowerCase() === 'rent' ? 'For Rent' : 'For Sale'}
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
            <ul className="meta-list flex" style={{ gap: '24px' }}>
              <li className="text-1 flex items-center">
                <i className="icon-bed" />
                <span style={{ marginLeft: '4px' }}>{property.bedrooms || 0}</span>
              </li>
              <li className="text-1 flex items-center">
                <i className="icon-bath" />
                <span style={{ marginLeft: '4px' }}>{property.bathrooms || 0}</span>
              </li>
              <li className="text-1 flex items-center">
                <i className="icon-sqft" />
                <span style={{ marginLeft: '4px' }}>{property.size || 0}</span> Sqft
              </li>
            </ul>
            <div className="bot flex justify-between items-center">
              <div>
                <h5 className="price">
                  {(() => {
                    const currencySymbols = {
                      'USD': '$',
                      'SYP': 'SYP',
                      'TRY': '₺',
                      'EUR': '€'
                    };
                    const currency = property?.currency || 'USD';
                    const symbol = currencySymbols[currency] || currency;
                    return `${symbol}${property.propertyPrice?.toLocaleString() || '0'}`;
                  })()}
                </h5>
                
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

"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import { useSearchListings } from "@/apis/hooks";
import FavoriteButton from "@/components/common/FavoriteButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import styles from "./Properties2.module.css";

export default function Properties2() {
  // Use search endpoint with empty params to get all listings
  const { data: searchResponse, isLoading, isError, error } = useSearchListings({});
  const listings = searchResponse?.data || [];

  // Function to get image source
  const getImageSource = (property) => {
    // Try different possible image sources
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage && firstImage.url) {
        return firstImage.url;
      }
    }
    
    // Try imageNames as fallback
    if (property.imageNames && property.imageNames.length > 0) {
      return property.imageNames[0];
    }
    
    // Return default image
    return "/images/section/box-house-1.jpg";
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center mb-48">
                <h2 className="title split-text effect-right">
                  <SplitTextAnimation text="Holiday Homes Listings" />
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
                </p>
              </div>
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading properties...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (isError) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center mb-48">
                <h2 className="title split-text effect-right">
                  <SplitTextAnimation text="Holiday Homes Listings" />
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
                </p>
              </div>
              <div className="text-center">
                <div className="alert alert-danger">
                  <h4>Error Loading Properties</h4>
                  <p>Failed to load properties. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state
  if (!listings || listings.length === 0) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center mb-48">
                <h2 className="title split-text effect-right">
                  <SplitTextAnimation text="Holiday Homes Listings" />
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
                </p>
              </div>
              <div className="text-center">
                <div className="alert alert-info">
                  <h4>No Properties Available</h4>
                  <p>There are currently no properties available. Check back later!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-listing tf-spacing-1">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section text-center mb-48">
              <h2 className="title split-text effect-right">
                <SplitTextAnimation text="Holiday Homes Listings" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Discover your perfect holiday retreat from our curated collection of vacation homes and rental properties.
              </p>
            </div>
            
            <div className="wrap-properties-sw">
              <Swiper
                dir="ltr"
                className=" style-pagination sw-properties"
                slidesPerView={1}
                spaceBetween={15}
                loop={true}
                autoplay={{
                  delay: 34444500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                modules={[Pagination, Autoplay]}
                pagination={{ el: ".spd-properties", clickable: true }}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 15 },
                  576: { slidesPerView: 1, spaceBetween: 15 },
                  768: { slidesPerView: 2, spaceBetween: 20 },
                  992: { slidesPerView: 2, spaceBetween: 30 },
                  1200: { slidesPerView: 3, spaceBetween: 30 },
                }}
              >
                {listings.slice(0, 6).map((property) => {
                  const imageSrc = getImageSource(property);
                  return (
                  <SwiperSlide key={property._id}>
                    <div className={`${styles.propertyCard}`}>
                      {/* Left Image Section - 300px x 220px */}
                      <div className={styles.leftSection}>
                        <div className={styles.imageSection}>
                          <Link href={`/property-detail/${property._id}`}>
                            <Image
                              className="lazyload"
                              alt={property.propertyKeyword || property.propertyType || "Property"}
                              src={imageSrc || "/images/section/box-house-1.jpg"}
                              width={300}
                              height={220}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              onError={(e) => {
                                e.target.src = "/images/section/box-house-1.jpg";
                              }}
                            />
                          </Link>
                          
                          {/* Badges */}
                          <div className={styles.badges}>
                            <span className={styles.badgeRent}>
                              {property.status === 'sale' ? 'For Sale' : 'For Rent'}
                            </span>
                            {property.propertyType === 'Holiday Homes' && (
                              <span className={styles.badgeHoliday}>
                                🏖️ Holiday
                              </span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className={styles.actionButtons}>
                            <FavoriteButton propertyId={property._id} showLabel={false} />
                            <a href="#" className={styles.quickViewBtn}>
                              <i className="icon-find-plus" />
                            </a>
                          </div>
                        </div>
                        
                        {/* Title and Location below image */}
                        <div className={styles.titleSection}>
                          <h6 className={styles.propertyTitle}>
                            {property.propertyKeyword || property.propertyType || 'Property'}
                          </h6>
                          <p className={styles.propertyLocation}>
                            <i className="icon-location" />
                            {property.address}, {property.state}
                          </p>
                        </div>
                        
                        {/* Price and Details below text */}
                        <div className={styles.priceDetailsSection}>
                          <div className={styles.price}>
                            ${property.propertyPrice?.toLocaleString() || '0'}
                          </div>
                          <Link href={`/property-detail/${property._id}`} className={styles.detailsBtn}>
                            Details
                          </Link>
                        </div>
                      </div>
                      
                      {/* Right Content Section */}
                      <div className={styles.contentSection}>
                        
                        {/* Details Grid */}
                        <div className={styles.detailsSection}>
                          <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                              <i className="icon-bed" />
                              <span>Beds <strong>{property.bedrooms}</strong></span>
                            </div>
                            <div className={styles.detailItem}>
                              <i className="icon-bath" />
                              <span>Baths <strong>{property.bathrooms}</strong></span>
                            </div>
                            <div className={styles.detailItem}>
                              <i className="icon-sqft" />
                              <span>Sqft <strong>{property.size}</strong></span>
                            </div>
                            <div className={styles.detailItem}>
                              <i className="icon-garage" />
                              <span>Garage <strong>{property.garages ? 'Yes' : 'No'}</strong></span>
                            </div>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </SwiperSlide>
                  );
                })}
              </Swiper>
              
              {/* Pagination dots */}
              <div className="sw-pagination sw-pagination-mb text-center mt-20 spd-properties" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

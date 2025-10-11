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
    return "/images/section/property-1.jpg";
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
                className="swiper style-pagination sw-properties"
                slidesPerView={1}
                spaceBetween={15}
                loop={true}
                autoplay={{
                  delay: 3500,
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
                    <div className={`box-house hover-img style-list ${styles.propertyCard}`}>
                      <div className="image-wrap" style={{ minWidth: '36%' }}>
                        <Link href={`/property-detail/${property._id}`}>
                          <Image
                            className="lazyload"
                            alt={property.propertyKeyword || property.propertyType || "Property"}
                            src={imageSrc}
                            width={435}
                            height={408}
                          />
                        </Link>
                        <ul className="box-tag flex gap-8">
                          <li className="flat-tag text-4 bg-main fw-6 text_white">
                            {property.status === 'sale' ? 'For Sale' : 'For Rent'}
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
                            {property.propertyKeyword || property.propertyType || 'Property'}
                          </Link>
                        </h5>
                        <p className="location text-1 line-clamp-1">
                          <i className="icon-location" /> {property.address}, {property.state}
                        </p>
                        <ul className="meta-list flex">
                          <li className="meta-item">
                            <div className="text-9 flex">
                              <i className="icon-bed" />
                              Beds<span>{property.bedrooms}</span>
                            </div>
                            <div className="text-9 flex">
                              <i className="icon-sqft" />
                              Sqft<span>{property.size}</span>
                            </div>
                          </li>
                          <li className="meta-item">
                            <div className="text-9 flex">
                              <i className="icon-bath" />
                              Baths<span>{property.bathrooms}</span>
                            </div>
                            <div className="text-9 flex">
                              <i className="icon-garage" />
                              Garage<span>{property.garages ? 'Yes' : 'No'}</span>
                            </div>
                          </li>
                        </ul>
                        <div className="bot flex justify-between items-center">
                          <h5 className="price" style={{ fontSize: '17px', fontWeight: '700', }}>
                            ${property.propertyPrice?.toLocaleString() || '0'}
                          </h5>
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

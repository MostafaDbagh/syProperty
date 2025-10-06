"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useSearchListings } from "@/apis/hooks";
import { getPropertyImage, getPropertyTitle } from "@/utlis/propertyHelpers";

export default function RelatedProperties({ currentProperty }) {
  // Calculate search parameters for similar properties
  const searchParams = useMemo(() => {
    if (!currentProperty) return {};

    const params = {
      limit: 6, // Get 6 similar properties
    };

    // Match same property type
    if (currentProperty.propertyType) {
      params.propertyType = currentProperty.propertyType;
    }

    // Match same status (rent/sale)
    if (currentProperty.status) {
      params.status = currentProperty.status;
    }

    // Match similar price range (±30%)
    if (currentProperty.propertyPrice) {
      const priceMargin = currentProperty.propertyPrice * 0.3;
      params.minPrice = Math.floor(currentProperty.propertyPrice - priceMargin);
      params.maxPrice = Math.ceil(currentProperty.propertyPrice + priceMargin);
    }

    // Match same country
    if (currentProperty.country) {
      params.country = currentProperty.country;
    }

    return params;
  }, [currentProperty]);

  // Fetch similar properties
  const { data: listingsData, isLoading, isError } = useSearchListings(searchParams);

  // Filter out the current property and limit results
  const similarProperties = useMemo(() => {
    if (!listingsData?.data) return [];
    
    return listingsData.data
      .filter(property => property._id !== currentProperty?._id)
      .slice(0, 6);
  }, [listingsData, currentProperty]);

  // Don't render if no similar properties or still loading
  if (isLoading) {
    return (
      <section className="section-similar-properties tf-spacing-3">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section mb-32">
                <h2 className="title">Similar Properties</h2>
              </div>
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading similar properties...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || similarProperties.length === 0) {
    return null; // Don't show the section if no similar properties
  }
  return (
    <section className="section-similar-properties tf-spacing-3">
      <div className="tf-container">
        <div className="row">
          <div className="col-12">
            <div className="heading-section mb-32">
              <h2 className="title">Similar Properties</h2>
            </div>
            <div
              className="swiper style-pagination tf-sw-mobile-1 sw-swiper-992"
              data-screen={992}
              data-preview={1}
              data-space={15}
            >
              <div
                className="swiper-wrapper tf-layout-mobile-xl lg-col-3 wrap-agent wow fadeInUp"
                data-wow-delay=".2s"
              >
                {similarProperties.map((property) => (
                    <div className="swiper-slide" key={property._id}>
                      <div className="box-house hover-img">
                        <div className="image-wrap">
                          <Link href={`/property-detail/${property._id}`}>
                            <Image
                              className="lazyload"
                              data-src={getPropertyImage(property)}
                              alt={getPropertyTitle(property)}
                              src={getPropertyImage(property)}
                              width={615}
                              height={405}
                            />
                          </Link>
                          <ul className="box-tag flex gap-8">
                            {property.offer && (
                              <li className="flat-tag text-4 bg-main fw-6 text_white">
                                Special Offer
                              </li>
                            )}
                            {property.status === 'sale' && (
                              <li className="flat-tag text-4 bg-3 fw-6 text_white">
                                For Sale
                              </li>
                            )}
                            {property.status === 'rent' && (
                              <li className="flat-tag text-4 bg-primary fw-6 text_white">
                                For Rent
                              </li>
                            )}
                          </ul>
                          <div className="list-btn flex gap-8">
                            <a href="#" className="btn-icon save hover-tooltip">
                              <i className="icon-save" />
                              <span className="tooltip">Add Favorite</span>
                            </a>
                            <a href="#" className="btn-icon find hover-tooltip">
                              <i className="icon-find-plus" />
                              <span className="tooltip">Quick View</span>
                            </a>
                          </div>
                        </div>
                        <div className="content">
                          <h5 className="title">
                            <Link href={`/property-detail/${property._id}`}>
                              {getPropertyTitle(property)}
                            </Link>
                          </h5>
                          <p className="location text-1 flex items-center gap-8">
                            <i className="icon-location" /> {property.address}, {property.state}
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
                            <h5 className="price">${property.propertyPrice?.toLocaleString()}</h5>
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
                    </div>
                ))}
              </div>
              <div className="sw-pagination sw-pagination-mb-1 text-center d-lg-none d-block mt-20" />
            </div>
            <Swiper
              className="swiper style-pagination tf-sw-mobile-1 sw-swiper-992"
              spaceBetween={15}
              modules={[Pagination]}
              pagination={{
                clickable: true,
                el: ".spd458",
              }}
            >
              {similarProperties.map((property) => (
                  <SwiperSlide className="swiper-slide" key={property._id}>
                    <div className="box-house hover-img">
                      <div className="image-wrap">
                        <Link href={`/property-detail/${property._id}`}>
                          <Image
                            className="lazyload"
                            data-src={getPropertyImage(property)}
                            alt={getPropertyTitle(property)}
                            src={getPropertyImage(property)}
                            width={615}
                            height={405}
                          />
                        </Link>
                        <ul className="box-tag flex gap-8">
                          {property.offer && (
                            <li className="flat-tag text-4 bg-main fw-6 text_white">
                              Special Offer
                            </li>
                          )}
                          {property.status === 'sale' && (
                            <li className="flat-tag text-4 bg-3 fw-6 text_white">
                              For Sale
                            </li>
                          )}
                          {property.status === 'rent' && (
                            <li className="flat-tag text-4 bg-primary fw-6 text_white">
                              For Rent
                            </li>
                          )}
                        </ul>
                        <div className="list-btn flex gap-8">
                          <a href="#" className="btn-icon save hover-tooltip">
                            <i className="icon-save" />
                            <span className="tooltip">Add Favorite</span>
                          </a>
                          <a href="#" className="btn-icon find hover-tooltip">
                            <i className="icon-find-plus" />
                            <span className="tooltip">Quick View</span>
                          </a>
                        </div>
                      </div>
                      <div className="content">
                        <h5 className="title">
                          <Link href={`/property-detail/${property._id}`}>
                            {getPropertyTitle(property)}
                          </Link>
                        </h5>
                        <p className="location text-1 flex items-center gap-8">
                          <i className="icon-location" /> {property.address}, {property.state}
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
                          <h5 className="price">${property.propertyPrice?.toLocaleString()}</h5>
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
              ))}

              <div className="sw-pagination sw-pagination-mb-1 text-center d-lg-none d-block mt-20 spd458" />
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

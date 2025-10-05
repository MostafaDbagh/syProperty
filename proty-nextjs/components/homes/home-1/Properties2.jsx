"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import { useListings } from "@/apis/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function Properties2() {
  const { data: listings = [], isLoading, isError } = useListings();
{console.log(listings),'listingssssfuck'}
  // Show loading state
  if (isLoading) {
    return (
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="heading-section text-center mb-48">
                <h2 className="title split-text effect-right">
                  <SplitTextAnimation text="Open Houses Listings" />
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Thousands of luxury home enthusiasts just like you visit our website.
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
                  <SplitTextAnimation text="Open Houses Listings" />
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Thousands of luxury home enthusiasts just like you visit our website.
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
                  <SplitTextAnimation text="Open Houses Listings" />
                </h2>
                <p className="text-1 split-text split-lines-transform">
                  Thousands of luxury home enthusiasts just like you visit our website.
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
                <SplitTextAnimation text="Open Houses Listings" />
              </h2>
              <p className="text-1 split-text split-lines-transform">
                Thousands of luxury home enthusiasts just like you visit our
                website.
              </p>
            </div>
            <div
              className="swiper style-pagination tf-sw-mobile sw-swiper-992"
              data-screen={992}
              data-preview={1}
              data-space={15}
            >
              <div className="swiper-wrapper tf-layout-mobile-lg lg-col-2 ">
                {listings.slice(0, 6).map((property) => (
                  <div className="swiper-slide" key={property._id}>
                    <div className="box-house hover-img style-list">
                      <div className="image-wrap">
                        <Link href={`/property-detail-v1/${property._id}`}>
                          <Image
                            className="lazyload"
                            data-src={property.images?.[0]?.url || "/images/section/property-1.jpg"}
                            alt={property.propertyKeyword || "Property"}
                            src={property.images?.[0]?.url || "/images/section/property-1.jpg"}
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
                          <Link href={`/property-detail-v1/${property._id}`}>
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
                          <h5 className="price">
                            ${property.propertyPrice?.toLocaleString() || '0'}
                          </h5>
                          <div className="wrap-btn flex">
                            <Link
                              href={`/property-detail-v1/${property._id}`}
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
              <div className="sw-pagination sw-pagination-mb text-center mt-20 d-lg-none d-block" />
            </div>
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
                el: ".spd447",
              }}
              spaceBetween={15}
              className="swiper style-pagination tf-sw-mobile sw-swiper-992"
            >
              {properties6.map((property) => (
                <SwiperSlide className="swiper-slide" key={property.id}>
                  <div className="box-house hover-img style-list">
                    <div className="image-wrap">
                      <Link href={`/property-detail/${property.id}`}>
                        <Image
                          className="lazyload"
                          data-src={property.imageSrc}
                          alt=""
                          src={property.imageSrc}
                          width={435}
                          height={408}
                        />
                      </Link>
                      <ul className="box-tag flex gap-8">
                        <li className="flat-tag text-4 bg-main fw-6 text_white">
                          For Sale
                        </li>
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
                        <Link href={`/property-detail/${property.id}`}>
                          {property.title}
                        </Link>
                      </h5>
                      <p className="location text-1 line-clamp-1">
                        <i className="icon-location" /> {property.location}
                      </p>
                      <ul className="meta-list flex">
                        <li className="meta-item">
                          <div className="text-9 flex">
                            <i className="icon-bed" />
                            Beds<span>{property.beds}</span>
                          </div>
                          <div className="text-9 flex">
                            <i className="icon-sqft" />
                            Sqft<span>{property.sqft}</span>
                          </div>
                        </li>
                        <li className="meta-item">
                          <div className="text-9 flex">
                            <i className="icon-bath" />
                            Baths<span>{property.baths}</span>
                          </div>
                          <div className="text-9 flex">
                            <i className="icon-garage" />
                            Garage<span>{property.garage}</span>
                          </div>
                        </li>
                      </ul>
                      <div className="bot flex justify-between items-center">
                        <h5 className="price">
                          {property.price.toLocaleString()}
                        </h5>
                        <div className="wrap-btn flex">
                          <Link
                            href={`/property-detail/${property.id}`}
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

              <div className="sw-pagination sw-pagination-mb text-center mt-20 d-lg-none d-block spd447" />
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

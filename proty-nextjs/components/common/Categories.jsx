"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import SplitTextAnimation from "./SplitTextAnimation";
import { listingAPI } from "@/apis/listing";

export default function Categories({
  parentClass = "tf-spacing-1 section-categories pb-0",
  searchParams,
  onSearchChange,
  setCategory
}) {
  // Get all properties for accurate counting (no pagination)
  const { data: allListingsResponse } = useQuery({
    queryKey: ['listings', 'all-count'],
    queryFn: () => listingAPI.searchListings({ limit: 100 }), // Reduced from 1000 to 100 for better performance
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
  
  const allListings = allListingsResponse?.data || [];


  // Create categories from API data with accurate counts
  const categories = [
    { name: "Apartment", icon: "icon-apartment1", count: allListings.filter(p => p.propertyType === 'Apartment').length },
    { name: "Villa", icon: "icon-villa", count: allListings.filter(p => p.propertyType === 'Villa').length },
    { name: "Studio", icon: "icon-studio", count: allListings.filter(p => p.propertyType === 'Studio').length },
    { name: "Office", icon: "icon-office1", count: allListings.filter(p => p.propertyType === 'Office').length },
    { name: "Townhouse", icon: "icon-townhouse", count: allListings.filter(p => p.propertyType === 'Townhouse').length },
    { name: "Commercial", icon: "icon-commercial", count: allListings.filter(p => p.propertyType === 'Commercial').length },
    { name: "Land/Plot", icon: "icon-land", count: allListings.filter(p => p.propertyType === 'Land').length }
  ];

  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName);
    onSearchChange({ propertyType: categoryName });
  };

  return (
    <section className={parentClass}>
      <div className="tf-container">
        <div className="heading-section text-center mb-48">
          <h2 className="title split-text effect-right">
            <SplitTextAnimation text="Try Searching For" />
          </h2>
          <p className="text-1 split-text split-lines-transform">
            Thousands of luxury home enthusiasts just like you have found their
            dream home
          </p>
        </div>

        <div className="wrap-categories-sw">
          <Swiper
            dir="ltr"
            className="swiper sw-layout style-pagination"
            spaceBetween={15}
            slidesPerView="auto"
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 15 },
              575: { slidesPerView: 3, spaceBetween: 20 },
              768: { slidesPerView: 4, spaceBetween: 25 },
              992: { slidesPerView: 5, spaceBetween: 30 },
              1200: { slidesPerView: 6, spaceBetween: 30 },
              1400: { slidesPerView: 7, spaceBetween: 30 },
            }}
            modules={[Autoplay, Pagination]}
            pagination={{ 
              el: ".spd2", 
              clickable: true,
              dynamicBullets: false,
            }}
          >
            {categories.map((category, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category.name)}
                  className={`categories-item ${
                    searchParams.propertyType === category.name ? "active" : ""
                  }`}
                >
                  <div className="icon-box">
                    <i className={`icon ${category.icon}`}></i>
                  </div>
                  <div className="content text-center">
                    <h5>{category.name}</h5>
                    <p className="mt-4 text-1">{category.count} Property</p>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Pagination dots for mobile and tablet */}
          <div 
            className="spd2" 
            style={{ 
              marginTop: '20px',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
            }} 
          />
          
          <style jsx>{`
            @media (min-width: 992px) {
              .spd2 {
                display: none !important;
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

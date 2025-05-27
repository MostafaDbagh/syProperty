"use client";

import { slides } from "@/data/testimonials";
import React from "react";
import { EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import SplitTextAnimation from "@/components/common/SplitTextAnimation";
import BrandSlider2 from "@/components/common/BrandSlider2";
export default function Testimonials() {
  return (
    <div className="section-testimonials style-2 bg-body-1 tf-spacing-8">
      <div className="tf-container">
        <div className="heading-section text-center gap-33 mb-48">
          <div className="title text-display-4 fw-5 text_white split-text effect-right">
            <SplitTextAnimation text=" What our customers says" />
          </div>
          <p
            className="text-1 text-color1 wow animate__fadeInUp animate__animated"
            data-wow-duration="1.5s"
            data-wow-delay="0s"
          >
            Our vision is to be the premier real estate company in New York,
            recognized for our unwavering <br />
            commitment to excellence, innovation, and community impact.
          </p>
        </div>
        <div className="relative">
          <Swiper
            dir="ltr"
            className="swiper sw-fipcard style-pagination dot-white"
            slidesPerView={1}
            initialSlide={1}
            effect={"cards"}
            grabCursor={true}
            centeredSlides
            cardsEffect={{
              slideShadows: false,

              perSlideOffset: 8,
              perSlideRotate: 10,
            }}
            modules={[EffectCards, Navigation, Pagination]}
            pagination={{
              el: ".spd18",
            }}
            navigation={{
              prevEl: ".snbp10",
              nextEl: ".snbn10",
            }}
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id} className="swiper-slide">
                <div className="wg-testimonial style-5">
                  <p className="text-11 description text_white fw-3">
                    {slide.description}
                  </p>
                  <div className="author">
                    <div className="avatar">
                      <Image alt="" width={51} height={51} src={slide.avatar} />
                    </div>
                    <div className="content">
                      <div className="name text-1">
                        <a href="#" className="text_white link">
                          {slide.name}
                        </a>
                      </div>
                      <p className="text-color2">{slide.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* Pagination */}
            <div className="sw-pagination sw-pagination-fipcard text-center mt-20 spd18" />
          </Swiper>
          <div className="swiper-button-prev sw-button style-5 sw-fipcard-prev md-hide snbp10">
            <i className="icon-arrow-left-3" />
          </div>
          <div className="swiper-button-next sw-button style-5 sw-fipcard-next md-hide snbn10">
            <i className="icon-arrow-right-3" />
          </div>
        </div>
        <BrandSlider2 />
      </div>
    </div>
  );
}

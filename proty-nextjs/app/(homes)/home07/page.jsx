import Header7 from "@/components/headers/Header7";
import Brands from "@/components/common/Brands";
import About from "@/components/homes/home-7/About";
import Blogs from "@/components/homes/home-7/Blogs";
import Contact from "@/components/homes/home-7/Contact";

import HelpCenter from "@/components/homes/home-7/HelpCenter";
import Hero from "@/components/homes/home-7/Hero";
import HighlightSection from "@/components/homes/home-7/HighlightSection";
import Properties from "@/components/homes/home-7/Properties";
import PropertyGallery from "@/components/homes/home-7/PropertyGallery";
import Testimonials from "@/components/homes/home-7/Testimonials";
import React from "react";
import Footer1 from "@/components/footers/Footer1";
import Footer2 from "@/components/footers/Footer2";

export const metadata = {
  title: "Home 07 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header7 />
        <Hero />
        <div className="main-content bg-color-white">
          <HighlightSection />
          <About />
          <HelpCenter />
          <Properties />
          <Testimonials />
          <PropertyGallery />
          <Blogs parentClass="section-opinion tf-spacing-7 pt-0" />
          <Contact />
          <Brands parentClass="section-work-together style-2 tf-spacing-7" />
        </div>
        <Footer2 parentClass="style-2" />
      </div>
    </>
  );
}

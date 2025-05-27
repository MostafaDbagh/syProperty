import Footer2 from "@/components/footers/Footer2";
import Header8 from "@/components/headers/Header8";
import Agents from "@/components/homes/home-8/Agents";
import Banner from "@/components/homes/home-8/Banner";
import Blogs from "@/components/homes/home-8/Blogs";
import Brands from "@/components/homes/home-8/Brands";
import Facts from "@/components/homes/home-8/Facts";
import FeaturedProperty from "@/components/homes/home-8/FeaturedProperty";
import Hero from "@/components/homes/home-8/Hero";
import Properties from "@/components/homes/home-8/Properties";
import Services from "@/components/homes/home-8/Services";
import Testimonials from "@/components/homes/home-8/Testimonials";
import WelcomeSection from "@/components/homes/home-8/WelcomeSection";
import React from "react";

export const metadata = {
  title: "Home 08 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header8 />
        <Hero />

        <div className="main-content bg-color-white">
          <Facts />
          <WelcomeSection />
          <FeaturedProperty />
          <Brands />
          <Properties />
          <Banner />
          <Testimonials />
          <Services />
          <Agents />
          <Blogs />
        </div>
        <Footer2 parentClass="style-2" />
      </div>
    </>
  );
}

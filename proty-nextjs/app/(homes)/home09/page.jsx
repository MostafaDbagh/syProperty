import Footer2 from "@/components/footers/Footer2";
import Header9 from "@/components/headers/Header9";
import About from "@/components/homes/home-9/About";
import Agents from "@/components/homes/home-9/Agents";
import Blogs from "@/components/homes/home-9/Blogs";
import Brands from "@/components/homes/home-9/Brands";
import Facts from "@/components/homes/home-9/Facts";
import Features from "@/components/homes/home-9/Features";
import Hero from "@/components/homes/home-9/Hero";
import Properties from "@/components/homes/home-9/Properties";
import Services from "@/components/homes/home-9/Services";
import Services2 from "@/components/homes/home-9/Services2";
import Testimonials from "@/components/homes/home-9/Testimonials";
import React from "react";

export const metadata = {
  title: "Home 09 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <div className="bg-body-1 wrap-top">
          <Header9 />
          <Hero />
        </div>
        <div className="main-content">
          <Facts />
          <About />
          <Services />
          <Properties />
          <Features />
          <Agents />
          <Services2 />
          <Testimonials />
          <Brands />
          <Blogs />
        </div>
        <Footer2 parentClass="style-2" />
      </div>
    </>
  );
}

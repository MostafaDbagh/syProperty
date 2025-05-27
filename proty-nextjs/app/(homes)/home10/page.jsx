import Footer2 from "@/components/footers/Footer2";
import Header10 from "@/components/headers/Header10";
import About from "@/components/homes/home-10/About";
import Agents from "@/components/homes/home-10/Agents";
import Blogs from "@/components/homes/home-10/Blogs";
import Brands from "@/components/homes/home-10/Brands";
import Contact from "@/components/homes/home-10/Contact";
import HelpSection from "@/components/homes/home-10/HelpSection";
import Hero from "@/components/homes/home-10/Hero";
import Properties from "@/components/homes/home-10/Properties";
import Properties2 from "@/components/homes/home-10/Properties2";
import Properties3 from "@/components/homes/home-10/Properties3";
import Testimonials from "@/components/homes/home-10/Testimonials";
import React from "react";

export const metadata = {
  title: "Home 10 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <div id="wrapper" className="counter-scroll">
        <Header10 />
        <Hero />
        <div className="main-content overflow-hidden">
          <Brands />
          <Properties />
          <Contact />
          <HelpSection />
          <About />
          <Properties2 />
          <Agents />
          <Properties3 />
          <Testimonials />
          <Blogs />
        </div>
        <Footer2 parentClass="style-2" />
      </div>
    </>
  );
}

import Header3 from "@/components/headers/Header3";
import Topbar from "@/components/headers/Topbar";
import Categories from "@/components/common/Categories";
import Banner from "@/components/homes/home-3/Banner";
import HelpCenter from "@/components/homes/home-3/HelpCenter";

import Hero from "@/components/homes/home-3/Hero";
import React from "react";
import Properties from "@/components/homes/home-3/Properties";
import Agents from "@/components/homes/home-3/Agents";
import Featured from "@/components/homes/home-3/Featured";
import Features from "@/components/homes/home-3/Features";
import Testimonials from "@/components/homes/home-3/Testimonials";
import Brands from "@/components/homes/home-3/Brands";
import Blogs from "@/components/homes/home-2/Blogs";
import Footer1 from "@/components/footers/Footer1";
import ThemeController from "@/components/common/ThemeController";

export const metadata = {
  title: "Home 03 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <ThemeController themeColor={"theme-color-2"} />
      <div id="wrapper">
        <Topbar />
        <Header3 />
        <Hero />
        <div className="main-content">
          <HelpCenter />
          <Banner />
          <Categories />
          <Properties />
          <Agents />
          <Featured />
          <Features />
          <Testimonials />
          <Brands />
          <Blogs />
        </div>
        <Footer1 logo="/images/logo/logo-4.1@2x.png" />
      </div>
    </>
  );
}

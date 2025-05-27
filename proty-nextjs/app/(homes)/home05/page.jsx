import Categories from "@/components/common/Categories";
import Header5 from "@/components/headers/Header5";
import Services from "@/components/homes/home-5/Service";
import Hero from "@/components/homes/home-5/Hero";
import Properties from "@/components/homes/home-5/Properties";
import React from "react";
import Brands from "@/components/homes/home-5/Brands";
import Testimonials from "@/components/homes/home-5/Testimonials";
import DownloadApp from "@/components/homes/home-5/DownloadApp";
import Agents from "@/components/homes/home-5/Agents";
import LoanCalculator from "@/components/homes/home-5/LoanCalculator";
import Blogs from "@/components/homes/home-2/Blogs";
import Cta from "@/components/homes/home-5/Cta";
import Footer1 from "@/components/footers/Footer1";
import ThemeController from "@/components/common/ThemeController";

export const metadata = {
  title: "Home 05 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <ThemeController themeColor={"theme-color-4"} />
      <div id="wrapper">
        <Header5 />
        <Hero />
        <div className="main-content">
          <Properties />
          <Categories parentClass="tf-spacing-1 section-categories pt-0" />
          <Services />
          <Brands />
          <Testimonials />
          <DownloadApp />
          <Agents />
          <LoanCalculator />
          <Blogs parentClass="section-opinion tf-spacing-1 pt-0" />
          <Cta />
        </div>
        <Footer1 logo="/images/logo/logo-6@2x.png" />
      </div>
    </>
  );
}

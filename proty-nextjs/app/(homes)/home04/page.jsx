import Categories from "@/components/common/Categories";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Topbar2 from "@/components/headers/Topbar2";
import Blogs from "@/components/homes/home-2/Blogs";
import Banner from "@/components/homes/home-4/Banner";
import Brands from "@/components/common/Brands";
import Facts from "@/components/homes/home-4/Facts";
import HelpCenter from "@/components/homes/home-4/HelpCenter";
import Hero from "@/components/homes/home-4/Hero";
import Locations from "@/components/homes/home-4/Locations";
import Properties from "@/components/homes/home-4/Properties";
import Properties2 from "@/components/homes/home-4/Properties2";
import Services from "@/components/homes/home-4/Services";
import Testimonials from "@/components/homes/home-4/Testimonials";
import React from "react";
import ThemeController from "@/components/common/ThemeController";

export const metadata = {
  title: "Home 04 || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <>
      <ThemeController themeColor={"theme-color-3"} />
      <div id="wrapper" className="counter-scroll">
        <Topbar2 />
        <Header4 />
        <Hero />
        <div className="main-content">
          <Facts />
          <Categories />
          <Properties />
          <HelpCenter />
          <Locations />
          <Banner />
          <Properties2 />
          <Testimonials />
          <Brands />
          <Services />
          <Blogs />
        </div>
        <Footer1 logo="/images/logo/logo-5.1@2x.png" />
      </div>
    </>
  );
}

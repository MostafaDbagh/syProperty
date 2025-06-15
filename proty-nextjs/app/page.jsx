"use client";

import { useState } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import Categories from "@/components/common/Categories";
import Properties from "@/components/homes/home-1/Properties";
import Cities from "@/components/homes/home-1/Cities";
import Properties2 from "@/components/homes/home-1/Properties2";

export default function Home() {
  const [searchParams, setSearchParams] = useState({
    status: "", // sale or rent
    keyword: "", // search keyword
    priceMin: "", // min propertyPrice
    priceMax: "", // max propertyPrice
    sizeMin: "", // min size
    sizeMax: "", // max size
    state: "", // location state
    bedrooms: "", // number of bedrooms
    bathrooms: "", // number of bathrooms
    amenities: [],
    propertyType: "",
    furnished:""
  });

  const [triggerSearch, setTriggerSearch] = useState(false);
  const [category, setCategory] = useState("");

  const handleSearchChange = (newParams) =>
    setSearchParams((prev) => ({ ...prev, ...newParams }));

  return (
    <>
      <Header1 />
      <Hero
        searchParams={searchParams}
        onSearchChange={handleSearchChange}
        setTriggerSearch={setTriggerSearch}
      />
      <main className="main-content">
        <Categories
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          setTriggerSearch={setTriggerSearch}
          setCategory={setCategory}
        />
        <Properties
          searchParams={searchParams}
          triggerSearch={triggerSearch}
          category={category}
        />
        <Cities />
        <Properties2 />
      </main>
      <Footer1 />
    </>
  );
}

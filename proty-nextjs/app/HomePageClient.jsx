"use client";

import { useEffect, useState } from "react";
import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/headers/Header1";
import Hero from "@/components/homes/home-1/Hero";
import Categories from "@/components/common/Categories";
import Properties from "@/components/homes/home-1/Properties";
import Cities from "@/components/homes/home-1/Cities";
import Properties2 from "@/components/homes/home-1/Properties2";
import { useSearchListings } from "@/apis/hooks";
import { cleanParams } from "@/utlis/cleanedParams";

export default function HomePageClient() {
  const [searchParams, setSearchParams] = useState({
    status: "",
    keyword: "",
    priceMin: "",
    priceMax: "",
    sizeMin: "",
    sizeMax: "",
    state: "",
    bedrooms: "",
    bathrooms: "",
    amenities: [],
    propertyType: "",
    furnished: ""
  });

  const [triggerSearch, setTriggerSearch] = useState(false);
  const [category, setCategory] = useState("");
  const [params, setParams] = useState(null);

  useEffect(() => {
    if (triggerSearch || category) {
      const cleaned = cleanParams(searchParams);
      setParams(cleaned);
    }
  }, [searchParams, triggerSearch, category]);

  const {
    data: listings = [],
    isLoading,
    isError,
  } = useSearchListings(params);

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
          listings={listings}
          isLoading={isLoading}
          isError={isError}
        />
        <Cities />
        <Properties2 />
      </main>
      <Footer1 />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import DropdownSelect from "./DropdownSelect";
import Slider from "rc-slider";

export default function SearchForm({
  parentClass = "wd-search-form",
  searchParams = {},
  onSearchChange,
}) {
  const searchFormRef = useRef();

  useEffect(() => {
    const searchFormToggler = document.querySelector(".searchFormToggler");

    const handleToggle = (event) => {
      event.preventDefault();
      event.stopPropagation();
      searchFormRef.current.classList.toggle("show");
    };

    const handleClickOutside = (event) => {
      if (searchFormRef.current && 
          searchFormRef.current.classList.contains("show") &&
          !searchFormRef.current.contains(event.target) &&
          !searchFormToggler?.contains(event.target)) {
        console.log("Closing SearchForm - clicked outside");
        searchFormRef.current.classList.remove("show");
      }
    };

    if (searchFormToggler) {
      searchFormToggler.addEventListener("click", handleToggle);
    }

    // Use mousedown instead of click for better detection
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (searchFormToggler) {
        searchFormToggler.removeEventListener("click", handleToggle);
      }
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (key, value) => {
    if (onSearchChange) {
      onSearchChange({ [key]: value });
    }
  };

  const handleAmenityChange = (amenity) => {
    const newAmenities = new Set(searchParams.amenities || []);
    if (newAmenities.has(amenity)) {
      newAmenities.delete(amenity);
    } else {
      newAmenities.add(amenity);
    }
    handleChange("amenities", Array.from(newAmenities));
  };

  return (
    <div className={parentClass} ref={searchFormRef}>
      <div className="search-form-header mb-32">
        <h4 className="advanced-search-title">Advanced Search</h4>
      </div>
      <div className="group-price">
        <div className="widget-price">
          <label className="mb-2 title-price" htmlFor="priceRange">
            Price range 
          </label>
          <div className="box-title-price">
            <div className="caption-price">
              <span>from</span>{" "}
              <span className="value fw-6" id="slider-range-value1">
                ${(searchParams.priceMin ?? 0).toLocaleString()}
              </span>{" "}
              <span>to</span>{" "}
              <span className="value fw-6" id="slider-range-value2">
                ${(searchParams.priceMax ?? 1000000).toLocaleString()}
              </span>
            </div>
          </div>
          <Slider
            id="priceRange"
            range
            min={0}
            max={1000000}
            value={[
              searchParams.priceMin ? +searchParams.priceMin : 0,
              searchParams.priceMax ? +searchParams.priceMax : 1000000,
            ]}
            onChange={([min, max]) => {
              handleChange("priceMin", min);
              handleChange("priceMax", max);
            }}
          />
        </div>
        <div className="widget-price">
          <label className="mb-2 title-price" htmlFor="sizeRange">
            Size range
          </label>
          <div className="box-title-price">
            <div className="caption-price">
              <span>from</span>{" "}
              <span className="value fw-6" id="slider-range-value01">
                {searchParams.sizeMin ?? 0}
              </span>{" "}
              <span>to</span>{" "}
              <span className="value fw-6" id="slider-range-value02">
                {searchParams.sizeMax ?? 10000}
              </span>
            </div>
          </div>
          <Slider
            id="sizeRange"
            range
            min={0}
            max={10000}
            value={[
              searchParams.sizeMin ? +searchParams.sizeMin : 0,
              searchParams.sizeMax ? +searchParams.sizeMax : 0,
            ]}
            onChange={([min, max]) => {
              handleChange("sizeMin", min);
              handleChange("sizeMax", max);
            }}
          />
        </div>
      </div>
      <div className="group-select">
        <div className="box-select">
          <label className="mb-2" htmlFor="provinceSelect">
            Province / States
          </label>
          <DropdownSelect
            id="provinceSelect"
            options={[
              "Province / States",
              "California",
              "Texas",
              "Florida",
              "New York",
              "Illinois",
              "Washington",
              "Pennsylvania",
            ]}
            addtionalParentClass=""
            value={searchParams.province || "Province / States"}
            onChange={(value) => handleChange("state", value)}
          />
        </div>
        <div className="box-select">
          <label className="mb-2" htmlFor="bedsSelect">
            Beds
          </label>
          <DropdownSelect
            id="bedsSelect"
            options={["Beds: Any", "1", "2", "3", "4", "5", "6"]}
            addtionalParentClass=""
            value={searchParams.beds || "Beds: Any"}
            onChange={(value) => handleChange("bedrooms", value)}
          />
        </div>

        <div className="box-select">
          <label className="mb-2" htmlFor="bathsSelect">
            Baths
          </label>
          <DropdownSelect
            id="bathsSelect"
            options={["Bath: Any", "1", "2", "3"]}
            addtionalParentClass=""
            value={searchParams.baths || "Bath: Any"}
            onChange={(value) => handleChange("bathrooms", value)}
          />
        </div>

        <div className="box-select">
  <label className="mb-2" htmlFor="furnishedSelect">
    Furnishing
  </label>
  <DropdownSelect
    id="furnishedSelect"
    options={["Any", "Furnished", "Unfurnished"]}
    addtionalParentClass=""
    value={
      searchParams.furnished === true
        ? "Furnished"
        : searchParams.furnished === false
        ? "Unfurnished"
        : "Any"
    }
    onChange={(value) => {
      let furnishedValue;
      if (value === "Furnished") furnishedValue = true;
      else if (value === "Unfurnished") furnishedValue = false;
      else furnishedValue = undefined; // "Any" clears the filter
      handleChange("furnished", furnishedValue);
    }}
  />
</div>
      </div>
      <div className="group-checkbox">
        <div className="title text-4 fw-6 mb-2">Amenities:</div>
        <div className="group-amenities">
          {[
            "Bed linens",
            "Carbon alarm",
            "Check-in lockbox",
            "Coffee maker",
            "Dishwasher",
            "Fireplace",
            "Extra pillows",
            "First aid kit",
            "Hangers",
            "Iron",
            "Microwave",
            "Fireplace",
            "Refrigerator",
            "Security cameras",
            "Smoke alarm",
            "Fireplace",
          ].map((amenity, idx) => (
            <fieldset
              className={`checkbox-item style-1${idx > 0 ? " mt-12" : ""}`}
              key={amenity + idx}
            >
              <label>
                <span className="text-4">{amenity}</span>
                <input
                  type="checkbox"
                  checked={searchParams.amenities?.includes(amenity) || false}
                  onChange={() => handleAmenityChange(amenity)}
                />
                <span className="btn-checkbox" />
              </label>
            </fieldset>
          ))}
        </div>
      </div>
    </div>
  );
}

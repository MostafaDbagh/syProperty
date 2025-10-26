"use client";

import { useEffect, useRef } from "react";
import DropdownSelect from "./DropdownSelect";
import DropdownTagSelect from "./DropdownTagSelect";
import Slider from "rc-slider";
import { provinceOptions } from "@/data/provinces";
import { amenitiesList } from "@/constants/amenities";

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
    <>
      <style jsx>{`
        /* Form layout utilities */
        .form-row-flex {
          display: flex !important;
          gap: 24px !important;
          align-items: flex-end !important;
          flex-wrap: wrap !important;
        }
        
        .form-row-item {
          flex: 1 !important;
          min-width: 280px !important;
        }
        
        .form-label {
          font-size: 14px !important;
          font-weight: 600 !important;
          color: #333 !important;
          display: block !important;
        }
        
        .form-input-enhanced {
          width: 100% !important;
          height: 56px !important;
          border-radius: 12px !important;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
          border: 2px solid #e8e8e8 !important;
          padding: 0 20px !important;
          font-size: 14px !important;
          color: #333 !important;
          background-color: #fff !important;
          transition: all 0.3s ease !important;
          outline: none !important;
        }
        
        .form-input-enhanced:focus {
          border-color: #ff6b35 !important;
          box-shadow: 0 4px 20px rgba(255, 107, 53, 0.15) !important;
        }
        
        /* Enhanced City Dropdown Styling for style-3 */
        .wd-search-form.style-3 .city-dropdown .nice-select {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          transition: all 0.3s ease;
          height: 56px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select:hover {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select.open {
          border-color: #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1ecff;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option {
          padding: 12px 16px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option::before {
          content: "📍";
          margin-right: 8px;
          font-size: 14px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(4px);
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list .option.selected::after {
          content: "✓";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }
        
        /* Custom scrollbar for city dropdown in style-3 */
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar {
          width: 6px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .wd-search-form.style-3 .city-dropdown .nice-select .list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
        
        /* Enhanced City Dropdown Styling for all SearchForm variants */
        .wd-search-form .city-dropdown .nice-select {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          transition: all 0.3s ease;
          height: 56px;
        }
        
        .wd-search-form .city-dropdown .nice-select:hover {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        .wd-search-form .city-dropdown .nice-select.open {
          border-color: #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        }
        
        .wd-search-form .city-dropdown .nice-select .list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1ecff;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option {
          padding: 12px 16px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option::before {
          content: "📍";
          margin-right: 8px;
          font-size: 14px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(4px);
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .wd-search-form .city-dropdown .nice-select .list .option.selected::after {
          content: "✓";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }
        
        /* Custom scrollbar for city dropdown in SearchForm */
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar {
          width: 6px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .wd-search-form .city-dropdown .nice-select .list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
      `}</style>
      <div className={parentClass} ref={searchFormRef}>
        <div className="search-form-header mb-32">
          <h4 className="advanced-search-title">Advanced Search</h4>
        </div>
        
        {/* Syria Cities and Property ID Row */}
        <div className="group-input mb-30 form-row-flex">
          <div className="box-input form-row-item">
            <label className="mb-2 form-label" htmlFor="syriaCitiesSelect">
              Syria Cities
            </label>
            <div className="city-dropdown">
              <DropdownSelect
                id="syriaCitiesSelect"
                options={[
                  "All Cities",
                  "Latakia",
                  "Damascus",
                  "Aleppo",
                  "Homs",
                  "Hama",
                  "Idlib",
                  "Deir ez-Zor",
                  "Daraa",
                  "Tartous"
                ]}
                addtionalParentClass=""
                selectedValue={searchParams.cities || "All Cities"}
                onChange={(value) => handleChange("cities", value === "All Cities" ? "" : value)}
              />
            </div>
          </div>
          <div className="box-input form-row-item">
            <label className="mb-2 form-label" htmlFor="propertyId">
              Property ID
            </label>
            <input
              type="text"
              id="propertyId"
              className="form-control form-input-enhanced"
              placeholder="Enter Property ID"
              value={searchParams.propertyId || ""}
              onChange={(e) => handleChange("propertyId", e.target.value)}
            />
          </div>
        </div>
      
      {/* Cities Dropdown for style-3 */}
      {parentClass.includes('style-3') && (
        <div className="group-input mb-30">
          <div className="box-input">
            <label className="mb-2 form-label" htmlFor="citiesSelectStyle3">
              Cities
            </label>
            <div className="city-dropdown">
              <DropdownSelect
                options={[
                  "All Cities",
                  "Latakia",
                  "Damascus",
                  "Aleppo",
                  "Homs",
                  "Hama",
                  "Idlib",
                  "Deir ez-Zor",
                  "Daraa",
                  "Tartous",
                ]}
                addtionalParentClass=""
                selectedValue={searchParams.state || "All Cities"}
                onChange={(value) => handleChange("state", value === "All Cities" ? "" : value)}
              />
            </div>
          </div>
        </div>
      )}
      
      
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
            min={3000}
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
          <DropdownTagSelect
            id="bedsSelect"
            label="Beds"
            options={["Any", 'studio', "1", "2", "3", "4", "5", "6"]}
            addtionalParentClass=""
            value={searchParams.bedrooms || ""}
            onChange={(value) => handleChange("bedrooms", value)}
          />
        </div>

        <div className="box-select">
          <DropdownTagSelect
            id="bathsSelect"
            label="Baths"
            options={["Any", "1", "2", "3", "4", "5"]}
            addtionalParentClass=""
            value={searchParams.bathrooms || ""}
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
          {amenitiesList.map((amenity, idx) => (
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
    </>
  );
}

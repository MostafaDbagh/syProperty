"use client";
import Slider from "rc-slider";
import React, { useState, useEffect } from "react";
import DropdownSelect from "../common/DropdownSelect";
import { amenitiesList } from "@/constants/amenities";

export default function FilterModal({ onSearchChange, searchParams = {} }) {
  const [priceRange, setPriceRange] = useState([100, 700]);
  const [sizeRange, setSizeRange] = useState([200, 820]);
  
  // Initialize ranges from search parameters
  useEffect(() => {
    if (searchParams.priceMin !== undefined || searchParams.priceMax !== undefined) {
      setPriceRange([
        searchParams.priceMin || 100,
        searchParams.priceMax || 700
      ]);
    }
    if (searchParams.sizeMin !== undefined || searchParams.sizeMax !== undefined) {
      setSizeRange([
        searchParams.sizeMin || 200,
        searchParams.sizeMax || 820
      ]);
    }
  }, [searchParams.priceMin, searchParams.priceMax, searchParams.sizeMin, searchParams.sizeMax]);
  
  const handleChange = (key, value) => {
    if (onSearchChange) {
      onSearchChange({ [key]: value });
    }
  };
  
  return (
    <div className="modal modal-filter fade" id="modalFilter">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="wd-search-form style-3">
            <div className="title-box">
              <h4>Advanced Search</h4>
              <span
                className="close-modal icon-close"
                data-bs-dismiss="modal"
              />
            </div>
            
            {/* Property ID Input Field */}
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="propertyId">
                  Property ID
                </label>
                <input
                  type="text"
                  id="propertyId"
                  className="form-control"
                  placeholder="Enter Property ID"
                  value={searchParams.propertyId || ""}
                  onChange={(e) => handleChange("propertyId", e.target.value)}
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e0e0e0',
                    padding: '0 16px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div className="group-price">
              <div className="widget-price">
                <div className="box-title-price">
                  <span className="title-price">Price</span>
                  <div className="caption-price">
                    <span>from</span>{" "}
                    <span className="value fw-6" id="slider-range-value1">
                      ${priceRange[0].toLocaleString()}
                    </span>{" "}
                    <span>to</span>
                    <span className="value fw-6" id="slider-range-value2">
                      {" "}
                      ${priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
                <Slider
                  range
                  max={1000}
                  min={0}
                  value={priceRange}
                  onChange={(value) => {
                    setPriceRange(value);
                    handleChange("priceMin", value[0]);
                    handleChange("priceMax", value[1]);
                  }}
                />
              </div>
              <div className="widget-price">
                <div className="box-title-price">
                  <span className="title-price">Size range</span>
                  <div className="caption-price">
                    <span>from</span>{" "}
                    <span className="value fw-6" id="slider-range-value01">
                      {sizeRange[0]}
                    </span>{" "}
                    <span>to</span>{" "}
                    <span className="value fw-6" id="slider-range-value02">
                      {sizeRange[1]}
                    </span>
                  </div>
                </div>
                <Slider
                  range
                  max={1000}
                  min={0}
                  value={sizeRange}
                  onChange={(value) => {
                    setSizeRange(value);
                    handleChange("sizeMin", value[0]);
                    handleChange("sizeMax", value[1]);
                  }}
                />
              </div>
            </div>
            <div className="group-select">
              <div className="box-select">
                <label className="mb-2" htmlFor="stateSelect">
                  Province / States
                </label>
                <DropdownSelect
                  id="stateSelect"
                  options={["Any", "California", "Texas", "Florida", "New York", "Illinois", "Washington", "Pennsylvania", "Ohio", "Georgia", "North Carolina"]}
                  addtionalParentClass=""
                  value={searchParams.state || "Any"}
                  onChange={(value) => handleChange("state", value === "Any" ? "" : value)}
                />
              </div>
              
              <div className="box-select">
                <label className="mb-2" htmlFor="propertyTypeSelect">
                  Property Type
                </label>
                <DropdownSelect
                  id="propertyTypeSelect"
                  options={["Any", "Holiday Homes", "Apartment", "House", "Villa", "Commercial", "Land"]}
                  addtionalParentClass=""
                  value={searchParams.propertyType || "Any"}
                  onChange={(value) => handleChange("propertyType", value === "Any" ? "" : value)}
                />
              </div>
              
              <div className="box-select">
                <label className="mb-2" htmlFor="bathsSelect">
                  Baths
                </label>
                <DropdownSelect
                  id="bathsSelect"
                  options={["Any", "1", "2", "3", "4", "5", "6"]}
                  addtionalParentClass=""
                  value={searchParams.bathrooms || "Any"}
                  onChange={(value) => handleChange("bathrooms", value === "Any" ? "" : value)}
                />
              </div>
              
              <div className="box-select">
                <label className="mb-2" htmlFor="bedsSelect">
                  Beds
                </label>
                <DropdownSelect
                  id="bedsSelect"
                  options={["Any", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                  addtionalParentClass=""
                  value={searchParams.bedrooms || "Any"}
                  onChange={(value) => handleChange("bedrooms", value === "Any" ? "" : value)}
                />
              </div>
            </div>
            <div className="group-checkbox">
              <div className="title text-4 fw-6">Amenities:</div>
              <div className="group-amenities">
                {amenitiesList.map((amenity, index) => (
                  <fieldset key={amenity} className={`checkbox-item style-1 ${index > 0 ? 'mt-12' : ''}`}>
                    <label>
                      <span className="text-4">{amenity}</span>
                      <input 
                        type="checkbox" 
                        checked={searchParams.amenities?.includes(amenity) || false}
                        onChange={(e) => {
                          const newAmenities = new Set(searchParams.amenities || []);
                          if (e.target.checked) {
                            newAmenities.add(amenity);
                          } else {
                            newAmenities.delete(amenity);
                          }
                          handleChange("amenities", Array.from(newAmenities));
                        }}
                      />
                      <span className="btn-checkbox" />
                    </label>
                  </fieldset>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

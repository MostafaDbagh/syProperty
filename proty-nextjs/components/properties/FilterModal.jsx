"use client";
import Slider from "rc-slider";
import React, { useState, useEffect } from "react";
import DropdownSelect from "../common/DropdownSelect";
import DropdownTagSelect from "../common/DropdownTagSelect";
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
    <>
      <style jsx>{`
        /* Property ID Input Styling */
        .property-id-input {
          width: 100% !important;
          height: 56px !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #e0e0e0 !important;
          padding: 0 16px !important;
          font-size: 14px !important;
        }
        
        /* Enhanced City Dropdown Styling for FilterModal */
        .modal-filter .city-dropdown .nice-select {
          background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
          border: 2px solid #e1ecff;
          border-radius: 12px;
          transition: all 0.3s ease;
          height: 56px;
        }
        
        .modal-filter .city-dropdown .nice-select:hover {
          border-color: #667eea;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        .modal-filter .city-dropdown .nice-select.open {
          border-color: #667eea;
          box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
        }
        
        .modal-filter .city-dropdown .nice-select .list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1ecff;
          max-height: 300px;
          overflow-y: auto;
          z-index: 9999;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option {
          padding: 12px 16px;
          font-weight: 500;
          color: #4a5568;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option::before {
          content: "📍";
          margin-right: 8px;
          font-size: 14px;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateX(4px);
        }
        
        .modal-filter .city-dropdown .nice-select .list .option.selected {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }
        
        .modal-filter .city-dropdown .nice-select .list .option.selected::after {
          content: "✓";
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-weight: bold;
        }
        
        /* Custom scrollbar for city dropdown in FilterModal */
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar {
          width: 6px;
        }
        
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }
        
        .modal-filter .city-dropdown .nice-select .list::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }
      `}</style>
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
            
            {/* Syria Cities Dropdown */}
    

            {/* Property ID Input Field */}
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="propertyId">
                  Property ID
                </label>
                <input
                  type="text"
                  id="propertyId"
                  className="form-control property-id-input"
                  placeholder="Enter Property ID"
                  value={searchParams.propertyId || ""}
                  onChange={(e) => handleChange("propertyId", e.target.value)}
                />
              </div>
            </div>
            <div className="group-input mb-30">
              <div className="box-input">
                <label className="mb-2" htmlFor="citiesSelect">
                   Cities
                </label>
                <div className="city-dropdown">
                  <DropdownSelect
                    id="citiesSelect"
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
                  <span className="title-price">Size</span>
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
                <DropdownTagSelect
                  id="bathsSelect"
                  label="Baths"
                  options={["Any", "1", "2", "3", "4", "5", "6"]}
                  addtionalParentClass=""
                  value={searchParams.bathrooms || ""}
                  onChange={(value) => handleChange("bathrooms", value)}
                />
              </div>
              
              <div className="box-select">
                <DropdownTagSelect
                  id="bedsSelect"
                  label="Beds"
                  options={["Any", 'studio', "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                  addtionalParentClass=""
                  value={searchParams.bedrooms || ""}
                  onChange={(value) => handleChange("bedrooms", value)}
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
    </>
  );
}

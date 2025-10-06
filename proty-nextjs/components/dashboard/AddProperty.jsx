"use client";
import React, { useState } from "react";
import Image from "next/image";
import DropdownSelect from "../common/DropdownSelect";
import { useCreateListing } from "@/apis/hooks";
import { toast } from "react-hot-toast";

export default function AddProperty() {
  const [formData, setFormData] = useState({
    propertyType: "",
    propertyKeyword: "",
    propertyDesc: "",
    propertyPrice: "",
    status: "",
    rentType: "monthly",
    bedrooms: "",
    bathrooms: "",
    size: "",
    landArea: "",
    furnished: false,
    garages: false,
    garageSize: "",
    yearBuilt: "",
    address: "",
    country: "",
    state: "",
    neighborhood: "",
    agent: "agent007",
    amenities: [],
    videoUrl: "",
    propertyId: `PROP${Date.now()}`
  });

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const createListingMutation = useCreateListing();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDropdownChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const handleAmenityChange = (amenity, checked) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.propertyType) newErrors.propertyType = "Property type is required";
    if (!formData.propertyPrice || isNaN(formData.propertyPrice)) newErrors.propertyPrice = "Valid price is required";
    if (!formData.status) newErrors.status = "Property status is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.neighborhood) newErrors.neighborhood = "Neighborhood is required";
    if (!formData.bedrooms || isNaN(formData.bedrooms)) newErrors.bedrooms = "Valid number of bedrooms is required";
    if (!formData.bathrooms || isNaN(formData.bathrooms)) newErrors.bathrooms = "Valid number of bathrooms is required";
    if (!formData.size || isNaN(formData.size)) newErrors.size = "Valid size is required";
    if (!formData.landArea || isNaN(formData.landArea)) newErrors.landArea = "Valid land area is required";
    if (!formData.propertyId) newErrors.propertyId = "Property ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        ...formData,
        propertyPrice: parseFloat(formData.propertyPrice),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        size: parseInt(formData.size),
        landArea: parseInt(formData.landArea),
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
        garageSize: formData.garageSize ? parseInt(formData.garageSize) : null,
        images: images,
        imageNames: images.map(img => img.name)
      };

      await createListingMutation.mutateAsync(submitData);
      
      toast.success("Property created successfully!");
      
      // Reset form
      setFormData({
        propertyType: "",
        propertyKeyword: "",
        propertyDesc: "",
        propertyPrice: "",
        status: "",
        rentType: "monthly",
        bedrooms: "",
        bathrooms: "",
        size: "",
        landArea: "",
        furnished: false,
        garages: false,
        garageSize: "",
        yearBuilt: "",
        address: "",
        country: "",
        state: "",
        neighborhood: "",
        agent: "agent007",
        amenities: [],
        videoUrl: "",
        propertyId: `PROP${Date.now()}`
      });
      setImages([]);
      setImagePreview([]);
      setErrors({});
      
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error(error?.message || "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenityOptions = [
    "Shared Gym", "Smart Controls", "BBQ Area", "Private Garden", "Children's Play Area",
    "Smoke alarm", "Self check-in with lockbox", "Carbon monoxide alarm", "Security cameras",
    "Hangers", "Extra pillows & blankets", "Bed linens", "TV with standard cable",
    "Refrigerator", "Dishwasher", "Microwave", "Coffee maker"
  ];

  return (
    <div className="main-content w-100">
      <div className="main-content-inner">
        <div className="button-show-hide show-mb">
          <span className="body-1">Show Dashboard</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Upload Media Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">Upload Media</h3>
            <div className="box-uploadfile text-center">
              <div className="uploadfile">
                <label
                  htmlFor="imageUpload"
                  className="tf-btn bg-color-primary pd-10 btn-upload mx-auto cursor-pointer"
                >
                  <svg
                    width={21}
                    height={20}
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.625 14.375V17.1875C13.625 17.705 13.205 18.125 12.6875 18.125H4.5625C4.31386 18.125 4.0754 18.0262 3.89959 17.8504C3.72377 17.6746 3.625 17.4361 3.625 17.1875V6.5625C3.625 6.045 4.045 5.625 4.5625 5.625H6.125C6.54381 5.62472 6.96192 5.65928 7.375 5.72834M13.625 14.375H16.4375C16.955 14.375 17.375 13.955 17.375 13.4375V9.375C17.375 5.65834 14.6725 2.57417 11.125 1.97834C10.7119 1.90928 10.2938 1.87472 9.875 1.875H8.3125C7.795 1.875 7.375 2.295 7.375 2.8125V5.72834M13.625 14.375H8.3125C8.06386 14.375 7.8254 14.2762 7.64959 14.1004C7.47377 13.9246 7.375 13.6861 7.375 13.4375V5.72834M17.375 11.25V9.6875C17.375 8.94158 17.0787 8.22621 16.5512 7.69876C16.0238 7.17132 15.3084 6.875 14.5625 6.875H13.3125C13.0639 6.875 12.8254 6.77623 12.6496 6.60041C12.4738 6.4246 12.375 6.18614 12.375 5.9375V4.6875C12.375 4.31816 12.3023 3.95243 12.1609 3.6112C12.0196 3.26998 11.8124 2.95993 11.5512 2.69876C11.2901 2.4376 10.98 2.23043 10.6388 2.08909C10.2976 1.94775 9.93184 1.875 9.5625 1.875H8.625"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Select photos
                  <input 
                    id="imageUpload"
                    type="file" 
                    className="ip-file" 
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                <p className="file-name fw-5">
                  or drag photos here <br />
                  <span>(Up to 10 photos)</span>
                </p>
              </div>
            </div>
            
            {imagePreview.length > 0 && (
              <div className="box-img-upload">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="item-upload file-delete">
                    <Image
                      alt="img"
                      width={615}
                      height={405}
                      src={preview}
                      className="object-cover"
                    />
                    <span 
                      className="icon icon-trashcan1 remove-file cursor-pointer"
                      onClick={() => removeImage(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="widget-box-2 mb-20">
            <h5 className="title">Information</h5>
            <div className="box-info-property">
              <fieldset className="box box-fieldset">
                <label htmlFor="propertyKeyword">
                  Property Keyword:<span>*</span>
                </label>
                <input
                  type="text"
                  name="propertyKeyword"
                  className="form-control"
                  placeholder="e.g., Luxury, Modern, Spacious"
                  value={formData.propertyKeyword}
                  onChange={handleInputChange}
                />
                {errors.propertyKeyword && <span className="text-danger">{errors.propertyKeyword}</span>}
              </fieldset>
              
              <fieldset className="box box-fieldset">
                <label htmlFor="propertyDesc">Description:</label>
                <textarea
                  name="propertyDesc"
                  className="textarea"
                  placeholder="Describe your property"
                  value={formData.propertyDesc}
                  onChange={handleInputChange}
                />
              </fieldset>
              
              <div className="box grid-layout-3 gap-30">
                <fieldset className="box-fieldset">
                  <label htmlFor="address">
                    Full Address:<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="form-control"
                    placeholder="Enter property full address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && <span className="text-danger">{errors.address}</span>}
                </fieldset>
               
                <fieldset className="box-fieldset">
                  <label htmlFor="country">
                    Country:<span>*</span>
                  </label>
                  <DropdownSelect
                    name="country"
                    options={["United States", "United Kingdom", "UAE", "Canada", "Australia"]}
                    selectedValue={formData.country}
                    onChange={(value) => handleDropdownChange('country', value)}
                    addtionalParentClass=""
                  />
                  {errors.country && <span className="text-danger">{errors.country}</span>}
                </fieldset>
              </div>
              
              <div className="box grid-layout-2 gap-30">
                <fieldset className="box-fieldset">
                  <label htmlFor="state">
                    Province/State:<span>*</span>
                  </label>
                  <DropdownSelect
                    name="state"
                    options={["Texas", "New York", "California", "Florida", "Damascus"]}
                    selectedValue={formData.state}
                    onChange={(value) => handleDropdownChange('state', value)}
                    addtionalParentClass=""
                  />
                  {errors.state && <span className="text-danger">{errors.state}</span>}
                </fieldset>
                
                <fieldset className="box-fieldset">
                  <label htmlFor="neighborhood">
                    Neighborhood:<span>*</span>
                  </label>
                  <DropdownSelect
                    name="neighborhood"
                    options={["Little Italy", "Bedford Park", "Smithbury", "Downtown", "Uptown"]}
                    selectedValue={formData.neighborhood}
                    onChange={(value) => handleDropdownChange('neighborhood', value)}
                    addtionalParentClass=""
                  />
                  {errors.neighborhood && <span className="text-danger">{errors.neighborhood}</span>}
                </fieldset>
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">Price</h3>
            <div className="box-price-property">
              <div className="box grid-2 gap-30">
                <fieldset className="box-fieldset mb-30">
                  <label htmlFor="propertyPrice">
                    Price:<span>*</span>
                  </label>
                  <input
                    type="number"
                    name="propertyPrice"
                    className="form-control"
                    placeholder="Example: 250000"
                    value={formData.propertyPrice}
                    onChange={handleInputChange}
                  />
                  {errors.propertyPrice && <span className="text-danger">{errors.propertyPrice}</span>}
                </fieldset>
                
                <fieldset className="box-fieldset mb-30">
                  <label htmlFor="rentType">
                    Unit Price:<span>*</span>
                  </label>
                  <DropdownSelect
                    name="rentType"
                    options={["monthly", "weekly", "daily", "yearly"]}
                    selectedValue={formData.rentType}
                    onChange={(value) => handleDropdownChange('rentType', value)}
                    addtionalParentClass=""
                  />
                </fieldset>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">Additional Information</h3>
            <div className="box grid-layout-3 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="propertyType">
                  Property Type:<span>*</span>
                </label>
                <DropdownSelect
                  name="propertyType"
                  options={["Apartment", "Villa", "Studio", "Office", "House"]}
                  selectedValue={formData.propertyType}
                  onChange={(value) => handleDropdownChange('propertyType', value)}
                  addtionalParentClass=""
                />
                {errors.propertyType && <span className="text-danger">{errors.propertyType}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="status">
                  Property Status:<span>*</span>
                </label>
                <DropdownSelect
                  name="status"
                  options={["rent", "sale"]}
                  selectedValue={formData.status}
                  onChange={(value) => handleDropdownChange('status', value)}
                  addtionalParentClass=""
                />
                {errors.status && <span className="text-danger">{errors.status}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="propertyId">
                  Property ID:<span>*</span>
                </label>
                <input
                  type="text"
                  name="propertyId"
                  className="form-control"
                  value={formData.propertyId}
                  onChange={handleInputChange}
                />
                {errors.propertyId && <span className="text-danger">{errors.propertyId}</span>}
              </fieldset>
            </div>
            
            <div className="box grid-layout-3 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="size">
                  Size (SqFt):<span>*</span>
                </label>
                <input
                  type="number"
                  name="size"
                  className="form-control"
                  value={formData.size}
                  onChange={handleInputChange}
                />
                {errors.size && <span className="text-danger">{errors.size}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="landArea">
                  Land Area (SqFt):<span>*</span>
                </label>
                <input
                  type="number"
                  name="landArea"
                  className="form-control"
                  value={formData.landArea}
                  onChange={handleInputChange}
                />
                {errors.landArea && <span className="text-danger">{errors.landArea}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="yearBuilt">
                  Year Built:
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  className="form-control"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                />
              </fieldset>
            </div>
            
            <div className="box grid-layout-3 gap-30">
              <fieldset className="box-fieldset">
                <label htmlFor="bedrooms">
                  Bedrooms:<span>*</span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  className="form-control"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                />
                {errors.bedrooms && <span className="text-danger">{errors.bedrooms}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="bathrooms">
                  Bathrooms:<span>*</span>
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  className="form-control"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                />
                {errors.bathrooms && <span className="text-danger">{errors.bathrooms}</span>}
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label htmlFor="garageSize">
                  Garage Size (SqFt):
                </label>
                <input
                  type="number"
                  name="garageSize"
                  className="form-control"
                  value={formData.garageSize}
                  onChange={handleInputChange}
                />
              </fieldset>
            </div>
            
            <div className="box grid-layout-2 gap-30">
              <fieldset className="box-fieldset">
                <label>
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Furnished</span>
                </label>
              </fieldset>
              
              <fieldset className="box-fieldset">
                <label>
                  <input
                    type="checkbox"
                    name="garages"
                    checked={formData.garages}
                    onChange={handleInputChange}
                  />
                  <span className="ml-2">Has Garages</span>
                </label>
              </fieldset>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="widget-box-2 mb-20">
            <h5 className="title">
              Amenities<span>*</span>
            </h5>
            <div className="box-amenities-property">
              <div className="grid grid-cols-2 gap-4">
                {amenityOptions.map((amenity) => (
                  <fieldset key={amenity} className="checkbox-item style-1">
                    <label>
                      <span className="text-4">{amenity}</span>
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                      />
                      <span className="btn-checkbox" />
                    </label>
                  </fieldset>
                ))}
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className="widget-box-2 mb-20">
            <h3 className="title">Videos</h3>
            <fieldset className="box-fieldset">
              <label htmlFor="videoUrl" className="text-btn">
                Video URL:
              </label>
              <input
                type="url"
                name="videoUrl"
                className="form-control"
                placeholder="Youtube, vimeo url"
                value={formData.videoUrl}
                onChange={handleInputChange}
              />
            </fieldset>
          </div>

          {/* Submit Buttons */}
          <div className="box-btn">
            <button
              type="submit"
              className="tf-btn bg-color-primary pd-13"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Property..." : "Add Property"}
            </button>
            
            <button
              type="button"
              className="tf-btn style-border pd-10"
              onClick={() => {
                // Save as draft functionality
                console.log("Save as draft:", formData);
                toast.success("Draft saved!");
              }}
            >
              Save & Preview
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="footer-dashboard">
          <p>Copyright © {new Date().getFullYear()} Proty</p>
          <ul className="list">
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="overlay-dashboard" />
    </div>
  );
}
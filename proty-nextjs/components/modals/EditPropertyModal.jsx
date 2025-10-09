import React, { useState, useEffect } from 'react';
import { listingAPI } from '@/apis/listing';

const EditPropertyModal = ({ isOpen, onClose, property, onSuccess }) => {
  const [formData, setFormData] = useState({
    propertyKeyword: '',
    address: '',
    propertyPrice: '',
    status: 'sale',
    approvalStatus: 'pending',
    description: '',
    bedrooms: '',
    bathrooms: '',
    squareFootage: '',
    yearBuilt: '',
    propertyType: '',
    amenities: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Available amenities list
  const availableAmenities = [
    'Shared Gym',
    'Smart Controls',
    'BBQ Area',
    'Private Garden',
    'Children\'s Play Area',
    'Smoke alarm',
    'Self check-in with lockbox',
    'Carbon monoxide alarm',
    'Security cameras',
    'Hangers',
    'Extra pillows & blankets',
    'Bed linens',
    'TV with standard cable',
    'Refrigerator',
    'Dishwasher',
    'Microwave',
    'Coffee maker'
  ];

  // Initialize form data when property changes
  useEffect(() => {
    if (property) {
      setFormData({
        propertyKeyword: property.propertyKeyword || '',
        address: property.address || '',
        propertyPrice: property.propertyPrice || '',
        status: property.status || 'sale',
        approvalStatus: property.approvalStatus || 'pending',
        description: property.description || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        squareFootage: property.squareFootage || '',
        yearBuilt: property.yearBuilt || '',
        propertyType: property.propertyType || '',
        amenities: property.amenities || []
      });
    }
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Handle adding custom amenity
  const handleAddCustomAmenity = (customAmenity) => {
    if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for API
      const updateData = {
        ...formData,
        propertyPrice: parseFloat(formData.propertyPrice) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        squareFootage: parseInt(formData.squareFootage) || 0,
        yearBuilt: parseInt(formData.yearBuilt) || new Date().getFullYear()
      };

      await listingAPI.updateListing(property._id, updateData);
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    onClose();
  };

  // Standard input styling
  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333333',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s ease',
    outline: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#333333',
    fontSize: '14px'
  };

  const handleInputFocus = (e) => {
    e.target.style.borderColor = '#007bff';
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = '#e1e5e9';
  };

  if (!isOpen || !property) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={handleCancel}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '0',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        margin: '20px'
      }}>
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '30px 40px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: '600',
            color: '#333333'
          }}>
            Edit Property
          </h2>
          <button 
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#999999',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f0f0f0';
              e.target.style.color = '#666666';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#999999';
            }}
          >
            ×
          </button>
        </div>

        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '0'
        }}>
          <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '24px',
                border: '1px solid #fcc',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gap: '28px' }}>
            {/* Property Title */}
            <div>
              <label style={labelStyle}>
                Property Title *
              </label>
              <input
                type="text"
                name="propertyKeyword"
                value={formData.propertyKeyword}
                onChange={handleInputChange}
                required
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Address */}
            <div>
              <label style={labelStyle}>
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Price and Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              <div>
                <label style={labelStyle}>
                  Price *
                </label>
                <input
                  type="number"
                  name="propertyPrice"
                  value={formData.propertyPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Property Type
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            {/* Property Details Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '28px' }}>
              <div>
                <label style={labelStyle}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Square Footage
                </label>
                <input
                  type="number"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  min="0"
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            {/* Additional Details Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
              <div>
                <label style={labelStyle}>
                  Year Built
                </label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Property Category
                </label>
                <input
                  type="text"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  placeholder="e.g., Apartment, House, Villa"
                  style={inputStyle}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '100px'
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </div>

            {/* Approval Status */}
            <div>
              <label style={labelStyle}>
                Approval Status
              </label>
              <select
                name="approvalStatus"
                value={formData.approvalStatus}
                onChange={handleInputChange}
                style={inputStyle}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label style={labelStyle}>
                Amenities
              </label>
              <div style={{
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {/* Available Amenities Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  {availableAmenities.map((amenity) => (
                    <label
                      key={amenity}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: formData.amenities.includes(amenity) ? '#e3f2fd' : '#f8f9fa',
                        border: formData.amenities.includes(amenity) ? '1px solid #2196f3' : '1px solid #e1e5e9',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                      onMouseEnter={(e) => {
                        if (!formData.amenities.includes(amenity)) {
                          e.target.style.backgroundColor = '#f0f0f0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!formData.amenities.includes(amenity)) {
                          e.target.style.backgroundColor = '#f8f9fa';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        style={{
                          margin: 0,
                          cursor: 'pointer'
                        }}
                      />
                      <span style={{
                        color: formData.amenities.includes(amenity) ? '#1976d2' : '#333333',
                        userSelect: 'none'
                      }}>
                        {amenity}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Selected Amenities */}
                {formData.amenities.length > 0 && (
                  <div>
                    <h4 style={{
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333333'
                    }}>
                      Selected Amenities ({formData.amenities.length})
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      {formData.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            backgroundColor: '#e3f2fd',
                            border: '1px solid #2196f3',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#1976d2'
                          }}
                        >
                          {amenity}
                          <button
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#1976d2',
                              cursor: 'pointer',
                              fontSize: '16px',
                              padding: '0',
                              width: '16px',
                              height: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'flex-end',
          padding: '30px 40px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa'
        }}>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            style={{
              padding: '12px 24px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              background: '#ffffff',
              color: '#666666',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s ease',
              minWidth: '100px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.backgroundColor = '#ffffff';
              }
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              background: loading ? '#94a3b8' : '#007bff',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#0056b3';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#007bff';
              }
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPropertyModal;

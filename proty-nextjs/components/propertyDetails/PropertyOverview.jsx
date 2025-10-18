"use client";
import React, { useState } from "react";
import { getStatusBadge } from "@/utlis/propertyHelpers";
import MoreAboutPropertyModal from "../modals/MoreAboutPropertyModal";
import { useCreateMessage } from "@/apis/hooks";
import styles from "./PropertyOverview.module.css";
import { HeartOutlineIcon, CompareIcon, PrintIcon, ShareIcon } from "@/components/icons";

export default function PropertyOverview({ property }) {
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const createMessageMutation = useCreateMessage();
  
  const statusBadge = getStatusBadge(property?.status);
  
  // Get CSS class for badge based on status
  const getBadgeClass = () => {
    const status = property?.status?.toLowerCase();
    if (status === 'rent') return styles.forRent;
    if (status === 'sale') return styles.forSale;
    return styles.default;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await createMessageMutation.mutateAsync({
        propertyId: property._id,
        agentId: property.agent || property.agentId,
        senderName: formData.senderName,
        senderEmail: 'user@example.com', // Default email since we don't have email field
        subject: `Ask a Question - ${property.propertyKeyword}`,
        message: formData.message,
        messageType: 'contact_agent'
      });

      setSubmitMessage('Question sent successfully!');
      setFormData({ senderName: '', message: '' });
    } catch (error) {
      setSubmitMessage(`Failed to send question: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="heading flex justify-between">
        <div className={`title text-5 fw-6 text-color-heading ${styles.titleWrapper}`}>
          <span>{property?.propertyType || 'Property Title'}</span>
          <span className={`${styles.statusBadge} ${getBadgeClass()}`}>
            {statusBadge.text}
          </span>
        </div>
        <div className="price text-5 fw-6 text-color-heading">
          ${property?.propertyPrice?.toLocaleString() || '0'}{" "}
          <span className="h5 lh-30 fw-4 text-color-default">
            /{property?.rentType || 'month'}
          </span>
        </div>
      </div>
      <div className="info flex justify-between">
        <div className="feature">
          <p className="location text-1 flex items-center gap-10">
            <i className="icon-location" />
            {property?.address || 'Property Location'}
          </p>
          <ul className="meta-list flex">
            <li className="text-1 flex">
              <span>{property?.bedrooms || '0'}</span>Bed
            </li>
            <li className="text-1 flex">
              <span>{property?.bathrooms || '0'}</span>Bath
            </li>
            <li className="text-1 flex">
              <span>{property?.size || '0'}</span>Sqft
            </li>
          </ul>
        </div>
        <div className="action">
          <ul className="list-action">
            <li>
              <a href="#">
                <HeartOutlineIcon />
              </a>
            </li>
            <li>
              <a href="#">
                <CompareIcon />
              </a>
            </li>
            <li>
              <a href="#">
                <PrintIcon />
              </a>
            </li>
            <li>
              <a href="#">
                <ShareIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="info-detail">
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-HouseLine" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">ID:</div>
              <div className="text-1 text-color-heading">{property?.propertyId || 'N/A'}</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Bathtub" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Bathrooms:</div>
              <div className="text-1 text-color-heading">{property?.bathrooms || '0'} Rooms</div>
            </div>
          </div>
        </div>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-SlidersHorizontal" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Type:</div>
              <div className="text-1 text-color-heading">{property?.propertyType || 'House'}</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Crop" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Land Size:</div>
              <div className="text-1 text-color-heading">{property?.landArea || '0'} SqFt</div>
            </div>
          </div>
        </div>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Garage-1" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Garages</div>
              <div className="text-1 text-color-heading">{property?.garages ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Hammer" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Year Built:</div>
              <div className="text-1 text-color-heading">{property?.yearBuilt || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div className="wrap-box">
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Bed-2" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Bedrooms:</div>
              <div className="text-1 text-color-heading">{property?.bedrooms || '0'} Rooms</div>
            </div>
          </div>
          <div className="box-icon">
            <div className="icons">
              <i className="icon-Ruler" />
            </div>
            <div className="content">
              <div className="text-4 text-color-default">Size:</div>
              <div className="text-1 text-color-heading">{property?.size || '0'} SqFt</div>
            </div>
          </div>
        </div>
      </div>
      {/* Submit Message */}
      {submitMessage && (
        <div className={`alert ${submitMessage.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-3`} style={{
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          backgroundColor: submitMessage.includes('successfully') ? '#fef7f1' : '#fee2e2',
          color: submitMessage.includes('successfully') ? '#f1913d' : '#991b1b',
          border: `1px solid ${submitMessage.includes('successfully') ? 'rgba(241, 145, 61, 0.15)' : '#fecaca'}`
        }}>
          {submitMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Your Name"
            name="senderName"
            value={formData.senderName}
            onChange={handleInputChange}
            required
            style={{ marginBottom: '12px' }}
          />
          <textarea
            name="message"
            className="form-control"
            placeholder="Ask a question about this property..."
            rows={3}
            value={formData.message}
            onChange={handleInputChange}
            required
            style={{ marginBottom: '16px' }}
          />
        </div>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="tf-btn bg-color-primary pd-21 fw-6"
          style={{ 
            border: 'none', 
            cursor: isSubmitting ? 'not-allowed' : 'pointer', 
            width: '100%',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Sending...' : 'Ask a question'}
        </button>
      </form>

      <MoreAboutPropertyModal 
        isOpen={isMoreInfoModalOpen}
        onClose={() => setIsMoreInfoModalOpen(false)}
        property={property}
      />
    </>
  );
}

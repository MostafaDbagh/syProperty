"use client";
import React, { useState } from "react";
import Image from "next/image";
import MoreAboutPropertyModal from "../modals/MoreAboutPropertyModal";
import { useCreateMessage } from "@/apis/hooks";

export default function Sidebar({ property }) {
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    senderName: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const createMessageMutation = useCreateMessage();
  
  // Extract agent contact information from property
  const agentEmail = property?.agentEmail || 
                     property?.agentId?.email || 
                     (typeof property?.agent === 'string' && property?.agent.includes('@') ? property?.agent : null) ||
                     property?.agent?.email ||
                     "contact@property.com";
  const agentNumber = property?.agentNumber || 
                      property?.agentId?.phone || 
                      property?.agent?.phone ||
                      "Not provided";
  const agentWhatsapp = property?.agentWhatsapp || 
                        property?.agentNumber || 
                        property?.agentId?.phone ||
                        property?.agent?.phone;
  const agentName = property?.agentId?.username || 
                    property?.agentId?.fullName ||
                    property?.agentId?.email ||
                    (typeof property?.agent === 'string' ? property?.agent : property?.agent?.username || property?.agent?.email) ||
                    "Property Agent";
  
  // Get agent avatar - check all possible image fields, fallback to default if no image
  const agentAvatar = property?.agentId?.avatar || 
                      property?.agentId?.image ||
                      property?.agentId?.imageUrl ||
                      property?.agent?.avatar ||
                      property?.agent?.image ||
                      property?.agent?.imageUrl ||
                      "/images/avatar/seller.jpg";

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
        subject: `Contact Agent - ${property.propertyKeyword}`,
        message: formData.message,
        messageType: 'inquiry'
      });

      setSubmitMessage('Message sent successfully!');
      setFormData({ senderName: '', message: '' });
    } catch (error) {
      setSubmitMessage(`Failed to send message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="tf-sidebar sticky-sidebar">
        <form
          className="form-contact-seller mb-30"
          onSubmit={handleSubmit}
        >
          <h4 className="heading-title mb-30">Contact Agent</h4>
          <div className="seller-info">
            <div className="avartar">
              <Image
                alt={agentName}
                src={agentAvatar}
                width={200}
                height={200}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
                onError={(e) => {
                  e.target.src = "/images/avatar/seller.jpg";
                }}
              />
            </div>
            <div className="content">
              <h6 className="name">{agentName}</h6>
              <ul className="contact">
                {agentNumber && agentNumber !== "Not provided" && (
                  <li>
                    <i className="icon-phone-1" />
                    <span>{agentNumber}</span>
                  </li>
                )}
                {agentEmail && (
                  <li>
                    <i className="icon-mail" />
                    <a href={`mailto:${agentEmail}`}>{agentEmail}</a>
                  </li>
                )}
                {agentWhatsapp && agentWhatsapp !== "Not provided" && (
                  <li>
                    <i className="icon-whatsapp" />
                    <a 
                      href={`https://wa.me/${agentWhatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
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
          
          <fieldset className="mb-12">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              name="senderName"
              id="name1"
              value={formData.senderName}
              onChange={handleInputChange}
              required
            />
          </fieldset>
          <fieldset className="mb-30">
            <textarea
              name="message"
              cols={30}
              rows={10}
              placeholder="How can an agent help"
              id="message1"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </fieldset>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="tf-btn bg-color-primary w-full"
            style={{ 
              border: 'none', 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </form>
        
        {/* More About This Property Button */}
        <div className="sidebar-ads mb-30">

          
          <div className="image-wrap">
            <Image
              className="lazyload"
              data-src="/images/blog/ads.jpg"
              alt="Property detail icon"
              src="/images/blog/ads.jpg"
              width={400}
              height={470}
            />
          </div>
          <div className="logo relative z-5">
            <Image
              alt="Property detail icon"
              src="/images/logo/logo-2@2x.png"
              width={272}
              height={85}
            />
          </div>
          <div className="box-ads relative z-5">
            <div className="content">
              <h4 className="title">
                <a href="#">We can help you find a local real estate agent</a>
              </h4>
              <div className="text-addres">
                <p>
                  Connect with a trusted agent who knows the market inside out -
                  whether you're buying or selling.
                </p>
              </div>
            </div>
            <a href="#" className="tf-btn fw-6 bg-color-primary fw-6 w-full">
              Connect with an agent
            </a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MoreAboutPropertyModal 
        isOpen={isMoreInfoModalOpen}
        onClose={() => setIsMoreInfoModalOpen(false)}
        property={property}
      />
    </>
  );
}

"use client";
import React, { useState } from "react";
import { useCreateMessage } from "@/apis/hooks";

export default function ContactAgentModal({ 
  isOpen, 
  onClose, 
  property, 
  agent 
}) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const createMessageMutation = useCreateMessage();

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
        agentId: property.agentId || property.agent,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        subject: `Contact Agent - ${property.propertyKeyword}`,
        message: formData.message,
        messageType: 'inquiry'
      });

      setSubmitMessage('Message sent successfully!');
      setFormData({ senderName: '', senderEmail: '', message: '' });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setSubmitMessage(`Failed to send message: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6b7280',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
            e.target.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#6b7280';
          }}
        >
          ×
        </button>

        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '24px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: 0,
            marginBottom: '8px'
          }}>
            Contact Agent
          </h3>
        </div>

        {/* Agent Info */}
        <div className="agent-info" style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          marginBottom: '24px'
        }}>
          <div className="agent-details" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#2c3e50',
              margin: 0,
              letterSpacing: '0.3px'
            }}>
              Property Agent
            </h4>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="icon-mail" style={{
                color: '#6c757d',
                fontSize: '14px'
              }} />
              <span style={{
                color: '#6c757d',
                fontSize: '14px',
                fontWeight: '400'
              }}>
                {agent?.email || 'sarah@realtor.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f1913d';
                e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Email *
            </label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f1913d';
                e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Message */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="How can an agent help"
              rows={4}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                backgroundColor: '#ffffff',
                resize: 'vertical',
                minHeight: '100px',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#f1913d';
                e.target.style.boxShadow = '0 0 0 3px rgba(241, 145, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px 24px',
              backgroundColor: '#f1913d',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(241, 145, 61, 0.3)',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#e67e22';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(241, 145, 61, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = '#f1913d';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(241, 145, 61, 0.3)';
              }
            }}
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
            {!isSubmitting && <i className="icon-arrow-right-2 fw-4" style={{ fontSize: '14px' }} />}
          </button>
        </form>
      </div>
    </div>
  );
}

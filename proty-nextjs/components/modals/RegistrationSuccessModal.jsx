"use client";
import React from "react";
import { createPortal } from "react-dom";

export default function RegistrationSuccessModal({ 
  isOpen, 
  onClose, 
  userEmail 
}) {
  console.log('🎉 RegistrationSuccessModal render - isOpen:', isOpen, 'userEmail:', userEmail);
  
  if (!isOpen) {
    console.log('❌ RegistrationSuccessModal not rendering because isOpen is false');
    return null;
  }

  console.log('✅ RegistrationSuccessModal rendering modal content');

  const modalContent = (
    <div 
      className="modal fade show"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        style={{
          maxWidth: '480px',
          width: '100%'
        }}
      >
        <div className="modal-content">
          <div className="flat-account">
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              {/* Success Icon */}
              <div 
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#25c55b', // Green color
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '40px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(37, 197, 91, 0.3)'
                }}
              >
                ✅
              </div>

              {/* Success Title */}
              <h2 style={{ 
                margin: '0 0 16px 0', 
                fontSize: '28px', 
                fontWeight: '700',
                color: 'var(--Heading)'
              }}>
                Registration Successful!
              </h2>

              {/* Success Message */}
              <p style={{ 
                margin: '0 0 24px 0', 
                color: 'var(--Text)', 
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                Your account has been created successfully. You can now login with your credentials.
              </p>

              {/* User Email */}
              <div style={{
                backgroundColor: 'var(--Sub-primary-1)',
                border: '1px solid var(--Sub-primary-2)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '32px'
              }}>
                <p style={{
                  margin: '0',
                  color: 'var(--Primary)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Account created for: {userEmail}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={onClose}
                  className="tf-btn bg-color-primary"
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    minWidth: '120px'
                  }}
                >
                  Continue
                </button>
              </div>

              {/* Additional Info */}
              <p style={{ 
                margin: '24px 0 0 0', 
                color: 'var(--Note)', 
                fontSize: '14px',
                fontStyle: 'italic'
              }}>
                You can now use the "Sign In" button to login to your account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render at document body level
  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

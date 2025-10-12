"use client";
import React, { useState, useEffect, useRef } from "react";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function OTPVerification({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userData,
  email,
  type = 'signup'
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const inputRefs = useRef([]);
  const { showSuccessModal, showWarningModal } = useGlobalModal();

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear OTP and auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(['', '', '', '', '', '']);
      setError('');
      setOtpVerified(false);
      
      if (inputRefs.current[0]) {
        setTimeout(() => {
          inputRefs.current[0].focus();
        }, 100);
      }
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-verify OTP when all 6 digits are filled
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6 && !otpVerified && !isLoading) {
      handleVerifyOTP();
    }
  }, [otp, otpVerified, isLoading]);

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e) e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const verifyResult = await authAPI.verifyOTP(email, otpString, type);
      
      if (verifyResult.success) {
        setOtpVerified(true);
        
        if (type === 'signup') {
          const result = await authAPI.signup(userData);
          
          if (result.success) {
            showSuccessModal(
              "Registration Successful!",
              "Your account has been created successfully. You can now login with your credentials.",
              userData?.email
            );
            onClose();
          } else {
            showWarningModal(
              "Registration Failed",
              result.message || "Registration failed. Please try again.",
              userData?.email
            );
          }
        } else if (type === 'forgot_password') {
          onSuccess(otpString);
        }
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      if (error.message) {
        setError(error.message);
      } else if (error.error) {
        setError(error.error);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('OTP verification failed. Please try again.');
      }
      
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsSendingOTP(true);
    setError('');

    try {
      await authAPI.sendOTP(email, type);
      setResendCooldown(30);
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleClose = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    setResendCooldown(0);
    setOtpVerified(false);
    onClose();
  };

  if (!isOpen || !isMounted) return null;

  // Debug logging for production
  console.log('🔄 OTPVerification: Rendering modal with isOpen:', isOpen, 'isMounted:', isMounted);

  // Simple inline-styled modal without CSS modules or portals
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      {/* Debug indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'lime',
        color: 'black',
        padding: '10px',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 1000000,
        borderRadius: '4px'
      }}>
        OTP MODAL IS RENDERING
      </div>
      
      {/* Modal content */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        maxWidth: '480px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h4 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#333' }}>
            {type === 'forgot_password' ? 'Email Verification for Reset Password' : 'Verify Your Email'}
          </h4>
          <span
            onClick={handleClose}
            style={{ cursor: 'pointer', fontSize: '24px', color: '#666' }}
          >
            ×
          </span>
        </div>
        
        {/* Email section */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#f0f8ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px'
          }}>
            📧
          </div>
          <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '16px' }}>
            {type === 'forgot_password' ? 'We\'ve sent a password reset code to' : 'We\'ve sent a 6-digit code to'}
          </p>
          <p style={{ margin: '0 0 16px 0', color: '#007bff', fontSize: '16px', fontWeight: '600' }}>
            {email}
          </p>
          
          {/* OTP Warning */}
          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '8px',
            display: 'inline-block'
          }}>
            <p style={{ margin: 0, color: '#856404', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span>⏰</span>
              OTP will expire after 5 minutes
            </p>
          </div>
        </div>

        {/* OTP Input */}
        <form onSubmit={handleVerifyOTP}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
              Enter verification code
            </label>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength="1"
                  style={{
                    width: '48px',
                    height: '56px',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: '600',
                    backgroundColor: '#fff',
                    outline: 'none'
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                {error}
              </div>
            )}
          </div>

          {/* Submit button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              type="submit"
              disabled={otp.join('').length !== 6 || isLoading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: otp.join('').length === 6 && !isLoading ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: otp.join('').length === 6 && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              {type === 'forgot_password' 
                ? (isLoading ? 'Verifying...' : 'Verify & Reset Password')
                : (isLoading ? 'Verifying...' : otpVerified ? 'Completing Registration...' : 'Verify & Complete Registration')
              }
            </button>
          </div>

          {/* Resend section */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0 || isSendingOTP}
              style={{
                background: 'none',
                border: 'none',
                color: '#007bff',
                cursor: resendCooldown > 0 || isSendingOTP ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'background-color 0.2s'
              }}
            >
              {isSendingOTP ? 'Sending...' : 
               resendCooldown > 0 ? 'Resend in ' + resendCooldown + 's' : 
               'Resend Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
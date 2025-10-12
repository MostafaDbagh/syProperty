"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { authAPI } from "@/apis/auth";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";
import styles from "./OTPVerification.module.css";

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
      // Clear OTP boxes when modal opens
      setOtp(['', '', '', '', '', '']);
      setError('');
      setOtpVerified(false);
      
      // Focus first input
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
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error when user types

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = ['', '', '', '', '', ''];
        digits.split('').forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        setError('');
        
        // Focus the last filled input or first empty
        const lastFilledIndex = digits.length - 1;
        const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : lastFilledIndex;
        inputRefs.current[focusIndex]?.focus();
      });
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
      // Verify OTP API call
      const verifyResult = await authAPI.verifyOTP(email, otpString, type);
      
      if (verifyResult.success) {
        setOtpVerified(true);
        
        if (type === 'signup') {
          // Call the actual signup API
          const result = await authAPI.signup(userData);
          
          if (result.success) {
            // Show global success modal
            showSuccessModal(
              "Registration Successful!",
              "Your account has been created successfully. You can now login with your credentials.",
              userData?.email
            );
            // Close the OTP verification modal immediately
            onClose();
            // Don't call onSuccess immediately - let the success modal handle the flow
          } else {
            // Show global warning modal for signup failure
            showWarningModal(
              "Registration Failed",
              result.message || "Registration failed. Please try again.",
              userData?.email
            );
          }
        } else if (type === 'forgot_password') {
          // For forgot password, just call onSuccess with OTP code, don't close modal
          console.log("🔄 Forgot password OTP verified, calling onSuccess");
          onSuccess(otpString);
        }
      } else {
        setError('Invalid OTP. Please try again.');
        // Clear OTP and focus first input
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      // More specific error handling
      if (error.message) {
        setError(error.message);
      } else if (error.error) {
        setError(error.error);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('OTP verification failed. Please try again.');
      }
      
      // Clear OTP and focus first input
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
      // Send OTP API call
      await authAPI.sendOTP(email, type);
      
      // Set cooldown timer (30 seconds)
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

  const modalContent = (
    <div 
      className={`modal fade show ${styles.modalBackdrop}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className={`modal-dialog modal-dialog-centered ${styles.modalDialog}`}>
        <div className="modal-content">
          <div className="flat-account">
            <form className="form-account" onSubmit={handleVerifyOTP}>
              <div className={`title-box ${type === 'forgot_password' ? styles.titleCenter : ''}`}>
                <h4>
                  {type === 'forgot_password' 
                    ? 'Email Verification for Reset Password' 
                    : 'Verify Your Email'}
                </h4>
                <span
                  className="close-modal icon-close"
                  onClick={handleClose}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              
              <div className="box">
            <div className={styles.emailSection}>
              <div className={styles.emailIcon}>
                📧
              </div>
              <p className={styles.mainMessage}>
                {type === 'forgot_password' 
                  ? 'We\'ve sent a password reset code to'
                  : 'We\'ve sent a 6-digit code to'}
              </p>
              <p className={styles.emailAddress}>
                {email}
              </p>
              
              {/* OTP Expiration Warning */}
              <div className={styles.otpWarning}>
                <p className={styles.warningText}>
                  <span>⏰</span>
                  OTP will expire after 5 minutes
                </p>
              </div>
            </div>

                <fieldset className="box-fieldset">
                  <label className={styles.otpLabel}>
                    Enter verification code
                  </label>
                  
                  <div className={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => inputRefs.current[index] = el}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength="1"
                        className={`form-control ${styles.otpInput}`}
                      />
                    ))}
                  </div>

                  {error && (
                    <div className={styles.errorMessage}>
                      {error}
                    </div>
                  )}
                </fieldset>
              </div>

              <div className="box box-btn">
                <button
                  type="submit"
                  className="tf-btn bg-color-primary w-full"
                  disabled={otp.join('').length !== 6 || isLoading}
                  style={{
                    opacity: (otp.join('').length === 6 && !isLoading) ? 1 : 0.6,
                    cursor: (otp.join('').length === 6 && !isLoading) ? 'pointer' : 'not-allowed',
                    border: 'none'
                  }}
                >
                  {type === 'forgot_password' 
                    ? (isLoading ? 'Verifying...' : 'Verify & Reset Password')
                    : (isLoading ? 'Verifying...' : otpVerified ? 'Completing Registration...' : 'Verify & Complete Registration')
                  }
                </button>
              </div>

              <div className="box">
                <div className={styles.resendContainer}>
                  <p className={styles.resendText}>
                    Didn't receive the code?
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendCooldown > 0 || isSendingOTP}
                    className={`text-color-primary ${styles.resendButton}`}
                  >
                    {isSendingOTP ? 'Sending...' : 
                     resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 
                     'Resend Code'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render at document body level only on client-side
  if (typeof window === 'undefined') return null;
  
  try {
    if (document?.body) {
      return createPortal(modalContent, document.body);
    }
  } catch (error) {
    console.error('Error creating portal for OTP modal:', error);
  }
  
  // Fallback: render directly if portal fails
  return modalContent;
}

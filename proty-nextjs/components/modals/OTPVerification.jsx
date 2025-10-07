"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { authAPI } from "@/apis/auth";
import styles from "./OTPVerification.module.css";

export default function OTPVerification({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userData, 
  email 
}) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
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
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Static OTP verification - always accepts 123456
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Static verification - only 123456 is valid
      if (otpString === '123456') {
        
        // Call the actual signup API
        const result = await authAPI.signup(userData);
        
        // Call success callback
        onSuccess(result);
        
      } else {
        setError('Invalid OTP. Please use code: 123456');
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
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsSendingOTP(true);
    setError('');

    try {
      // Static OTP sending - always sends 123456
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Static OTP - always 123456
      alert(`OTP sent to ${email}. Use code: 123456`);
      
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
    onClose();
  };

  if (!isOpen) return null;

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
              <div className="title-box">
                <h4>Verify Your Email</h4>
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
                We've sent a 6-digit code to
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
                  {isLoading ? 'Verifying...' : 'Verify & Complete Registration'}
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

                {/* Testing Hint */}
                <div className={styles.testingHint}>
                  <small className={styles.testingText}>
                    For testing: Use code <strong className={styles.testingCode}>123456</strong>
                  </small>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Use React Portal to render at document body level
  if (typeof window === 'undefined') return null;
  
  
  return createPortal(modalContent, document.body);
}

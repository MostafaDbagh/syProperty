"use client";
import React, { useState, useRef } from "react";
import styles from "./OTPVerification.module.css";

export default function OTPVerification({ isOpen, onClose, onSubmit, email }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("").slice(0, 6);
    
    while (newOtp.length < 6) {
      newOtp.push("");
    }
    
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(otpCode);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setError(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button 
          className={styles.closeButton} 
          onClick={handleClose} 
          aria-label="Close modal"
        >
          <i className="icon-close" />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.iconWrapper}>
            <i className="icon-shield-check" />
          </div>
          <h2 className={styles.modalTitle}>Enter Verification Code</h2>
          <p className={styles.modalSubtitle}>
            We've sent a 6-digit code to<br />
            <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.otpContainer} onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.otpInput}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && (
            <div className={styles.errorMessage}>
              <i className="icon-alert-circle" />
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || otp.join("").length !== 6}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner} />
                Verifying...
              </>
            ) : (
              <>
                <i className="icon-check-circle" />
                Verify Code
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className={styles.resendButton}
          >
            Didn't receive code? Resend
          </button>
        </form>
      </div>
    </div>
  );
}


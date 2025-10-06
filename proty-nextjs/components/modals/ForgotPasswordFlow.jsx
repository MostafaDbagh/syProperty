"use client";
import React, { useState, useEffect } from "react";
import ForgotPassword from "./ForgotPassword";
import OTPVerification from "./OTPVerification";
import NewPassword from "./NewPassword";

export default function ForgotPasswordFlow({ isOpen, onClose, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle email submission
  const handleEmailSubmit = async (userEmail) => {
    try {
      // TODO: Call API to send OTP
      // await authAPI.forgotPassword({ email: userEmail });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmail(userEmail);
      setCurrentStep(2); // Move to OTP verification
      
      console.log("📧 Reset code sent to:", userEmail);
    } catch (error) {
      throw new Error("Failed to send reset code. Please try again.");
    }
  };

  // Handle OTP verification
  const handleOTPSubmit = async (code) => {
    try {
      // TODO: Call API to verify OTP
      // await authAPI.verifyOTP({ email, otp: code });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpCode(code);
      setCurrentStep(3); // Move to new password
      
      console.log("✅ OTP verified:", code);
    } catch (error) {
      throw new Error("Invalid OTP code. Please try again.");
    }
  };

  // Handle password reset
  const handlePasswordReset = async (newPassword) => {
    try {
      // TODO: Call API to reset password
      // await authAPI.resetPassword({ email, otp: otpCode, newPassword });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("✅ Password reset successfully for:", email);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset and close
      handleFlowClose();
    } catch (error) {
      throw new Error("Failed to reset password. Please try again.");
    }
  };

  // Reset flow and close all modals
  const handleFlowClose = () => {
    setCurrentStep(1);
    setEmail("");
    setOtpCode("");
    onClose();
  };

  return (
    <>
      <ForgotPassword
        isOpen={isOpen && currentStep === 1}
        onClose={handleFlowClose}
        onSubmit={handleEmailSubmit}
      />

      <OTPVerification
        isOpen={isOpen && currentStep === 2}
        onClose={handleFlowClose}
        onSubmit={handleOTPSubmit}
        email={email}
      />

      <NewPassword
        isOpen={isOpen && currentStep === 3}
        onClose={handleFlowClose}
        onSubmit={handlePasswordReset}
      />
    </>
  );
}


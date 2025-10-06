"use client";
import React, { useState } from "react";
import ForgotPasswordFlow from "./ForgotPasswordFlow";

/**
 * Demo component showing how to use the Forgot Password Flow
 * 
 * To integrate with your Login component:
 * 1. Import ForgotPasswordFlow
 * 2. Add state: const [showForgotPassword, setShowForgotPassword] = useState(false);
 * 3. Add button/link: <button onClick={() => setShowForgotPassword(true)}>Forgot Password?</button>
 * 4. Add the component: <ForgotPasswordFlow isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} onSuccess={handleSuccess} />
 */

export default function ForgotPasswordDemo() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSuccess = () => {
    alert("Password reset successfully! You can now login with your new password.");
    // Optionally redirect to login or show login modal
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Forgot Password Demo</h1>
      <p style={{ marginBottom: "20px", color: "#666" }}>
        Click the button below to test the forgot password flow
      </p>
      
      <button
        onClick={() => setShowForgotPassword(true)}
        style={{
          padding: "14px 28px",
          background: "#F1913D",
          color: "#ffffff",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Open Forgot Password
      </button>

      <ForgotPasswordFlow
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSuccess={handleSuccess}
      />

      <div style={{ 
        marginTop: "40px", 
        padding: "20px", 
        background: "#f5f5f5", 
        borderRadius: "8px",
        textAlign: "left",
        maxWidth: "600px",
        margin: "40px auto 0"
      }}>
        <h3>Flow Steps:</h3>
        <ol style={{ lineHeight: "1.8" }}>
          <li><strong>Step 1:</strong> User enters email address</li>
          <li><strong>Step 2:</strong> User enters 6-digit OTP code</li>
          <li><strong>Step 3:</strong> User creates new password</li>
          <li><strong>Success:</strong> Password reset, user can login</li>
        </ol>
      </div>
    </div>
  );
}


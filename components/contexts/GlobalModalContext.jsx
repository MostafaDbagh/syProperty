"use client";
import React, { createContext, useContext, useState } from 'react';
import GlobalStatusModal from '../modals/GlobalStatusModal';
import Register from '../modals/Register';
import Login from '../modals/Login';
import ForgotPasswordFlow from '../modals/ForgotPasswordFlow';
import OTPVerification from '../modals/OTPVerification';

const GlobalModalContext = createContext();

export const useGlobalModal = () => {
  const context = useContext(GlobalModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider');
  }
  return context;
};

export const GlobalModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
    userEmail: ''
  });
  
  const [registerModalState, setRegisterModalState] = useState({
    isOpen: false
  });
  
  const [loginModalState, setLoginModalState] = useState({
    isOpen: false
  });
  
  const [forgotPasswordModalState, setForgotPasswordModalState] = useState({
    isOpen: false
  });
  
  const [otpModalState, setOtpModalState] = useState({
    isOpen: false,
    userData: null,
    email: '',
    type: 'signup'
  });

  const showSuccessModal = (title, message, userEmail = '') => {
    setModalState({
      isOpen: true,
      type: 'success',
      title,
      message,
      userEmail
    });
  };

  const showWarningModal = (title, message, userEmail = '') => {
    setModalState({
      isOpen: true,
      type: 'warning',
      title,
      message,
      userEmail
    });
  };

  const closeModal = () => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const showRegisterModal = () => {
    setRegisterModalState({
      isOpen: true
    });
  };

  const closeRegisterModal = () => {
    setRegisterModalState({
      isOpen: false
    });
  };

  const showLoginModal = () => {
    setLoginModalState({
      isOpen: true
    });
  };

  const closeLoginModal = () => {
    setLoginModalState({
      isOpen: false
    });
  };

  const showForgotPasswordModal = () => {
    setForgotPasswordModalState({
      isOpen: true
    });
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalState({
      isOpen: false
    });
  };

  const showOTPModal = (userData, email, type = 'signup') => {
    setOtpModalState({
      isOpen: true,
      userData,
      email,
      type
    });
  };

  const closeOTPModal = () => {
    setOtpModalState({
      isOpen: false,
      userData: null,
      email: '',
      type: 'signup'
    });
  };

  const value = {
    showSuccessModal,
    showWarningModal,
    closeModal,
    modalState,
    showRegisterModal,
    closeRegisterModal,
    registerModalState,
    showLoginModal,
    closeLoginModal,
    loginModalState,
    showForgotPasswordModal,
    closeForgotPasswordModal,
    forgotPasswordModalState,
    showOTPModal,
    closeOTPModal,
    otpModalState
  };

  return (
    <GlobalModalContext.Provider value={value}>
      {children}
      <GlobalStatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        userEmail={modalState.userEmail}
      />
      <Register
        isOpen={registerModalState.isOpen}
        onClose={closeRegisterModal}
      />
      <Login
        isOpen={loginModalState.isOpen}
        onClose={closeLoginModal}
      />
      <ForgotPasswordFlow
        isOpen={forgotPasswordModalState.isOpen}
        onClose={closeForgotPasswordModal}
        onSuccess={() => {
          closeForgotPasswordModal();
          showLoginModal();
        }}
      />
      <OTPVerification
        isOpen={otpModalState.isOpen}
        onClose={closeOTPModal}
        onSuccess={(result) => {
          closeOTPModal();
          // Show success modal or redirect as needed
          showSuccessModal('Registration Successful!', 'Your account has been created successfully. You can now log in.');
        }}
        userData={otpModalState.userData}
        email={otpModalState.email}
        type={otpModalState.type}
      />
      {/* Debug indicator for production */}
      {process.env.NODE_ENV === 'production' && otpModalState.isOpen && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'red',
          color: 'white',
          padding: '10px',
          zIndex: 10000,
          fontSize: '12px',
          borderRadius: '4px'
        }}>
          OTP Modal Should Be Visible
        </div>
      )}
    </GlobalModalContext.Provider>
  );
};

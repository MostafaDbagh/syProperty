"use client";
import React, { createContext, useContext, useState } from 'react';
import GlobalStatusModal from '../modals/GlobalStatusModal';

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

  const value = {
    showSuccessModal,
    showWarningModal,
    closeModal,
    modalState
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
    </GlobalModalContext.Provider>
  );
};

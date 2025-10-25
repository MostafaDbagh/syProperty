"use client";

import React, { useState } from "react";

export default function DropdownTagSelect({
  id,
  options = [],
  value = "",
  onChange,
  label = "",
  addtionalParentClass = "",
  placeholder = "Select option"
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option === "Any" ? "" : option);
    setIsOpen(false);
  };

  const displayValue = value || "Any";

  return (
    <div className={`dropdown-tag-select ${addtionalParentClass}`}>
      {label && (
        <label className="mb-2" htmlFor={id} style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#5c5E61',
          display: 'block'
        }}>
          {label}
        </label>
      )}
      
      <div className="tag-select-container">
        {/* Selected Value Display */}
        <div 
          className="selected-value-display"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '12px 16px',
            border: '2px solid #e8e8e8',
            borderRadius: '12px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#333',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            minHeight: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#e8e8e8';
            e.target.style.boxShadow = 'none';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e8e8e8';
            e.target.style.boxShadow = 'none';
          }}
        >
          <span>{displayValue}</span>
          <i className="icon-arrow-down" style={{
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            width: '12px',
            height: '19px',
            display: 'block',
            fontSize: '12px',
            color: '#333'
          }} />
        </div>

        {/* Options Grid */}
        {isOpen && (
          <div className="options-grid" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            zIndex: 1000,
            marginTop: '4px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
            gap: '8px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                className={`tag-option ${value === option ? 'selected' : ''}`}
                onClick={() => handleOptionClick(option)}
                style={{
                  padding: '8px',
                  border: '2px solid #e8e8e8',
                  borderRadius: '24px',
                  backgroundColor: value === option ? '#f1913d' : '#f8f9fa',
                  color: value === option ? '#fff' : '#333',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  borderColor: value === option ? '#f1913d' : '#e8e8e8'
                }}
                onMouseEnter={(e) => {
                  if (value !== option) {
                    e.target.style.backgroundColor = '#f1913d';
                    e.target.style.color = '#fff';
                    e.target.style.borderColor = '#f1913d';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option) {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.color = '#333';
                    e.target.style.borderColor = '#e8e8e8';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .dropdown-tag-select {
          position: relative;
          width: 100%;
        }
        
        .tag-select-container {
          position: relative;
          width: 100%;
        }
        
        .options-grid::-webkit-scrollbar {
          width: 6px;
        }
        
        .options-grid::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .options-grid::-webkit-scrollbar-thumb {
          background: #f1913d;
          border-radius: 3px;
        }
        
        .options-grid::-webkit-scrollbar-thumb:hover {
          background: #e07a2e;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .options-grid {
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr)) !important;
            gap: 6px !important;
            padding: 12px !important;
          }
          
          .tag-option {
            padding: 6px 8px !important;
            font-size: 12px !important;
            min-width: 40px !important;
          }
        }
        
        @media (max-width: 480px) {
          .options-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

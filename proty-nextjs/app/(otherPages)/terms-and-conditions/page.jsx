"use client";
import React from "react";
import Link from "next/link";
import { useGlobalModal } from "@/components/contexts/GlobalModalContext";

export default function TermsAndConditions() {
  const { showLoginModal, showRegisterModal } = useGlobalModal();

  const handleLoginClick = (e) => {
    e.preventDefault();
    showLoginModal();
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    showRegisterModal();
  };

  return (
    <div className="page-wrapper">
      {/* Clean Minimalist Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '20px 0',
        borderBottom: '1px solid #e5e5e5',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#000000',
            fontFamily: 'sans-serif',
            textDecoration: 'none'
          }}>
            <Link href="/" style={{ color: '#000000', textDecoration: 'none' }}>
              SyProperty
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            <Link href="/" style={{
              fontSize: '16px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400',
              transition: 'color 0.2s ease'
            }}>
              Home
            </Link>
            <Link href="/about" style={{
              fontSize: '16px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '700'
            }}>
              About Us
            </Link>
          </nav>

          {/* Login/Register Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button onClick={handleLoginClick} style={{
              fontSize: '16px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e5e5e5',
              transition: 'all 0.2s ease',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}>
              Login
            </button>
            <button onClick={handleRegisterClick} style={{
              fontSize: '16px',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600',
              padding: '10px 20px',
              borderRadius: '6px',
              backgroundColor: '#000000',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer'
            }}>
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Terms Content */}
      <section className="section-listing tf-spacing-1">
        <div className="tf-container">
          <div className="row">
            <div className="col-12">
              <div className="terms-content" style={{ 
                backgroundColor: '#ffffff', 
                padding: '40px 0', 
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.6',
                fontSize: '16px',
                fontFamily: 'sans-serif'
              }}>
                
                {/* Main Title - Centered */}
                <h1 style={{
                  fontSize: '48px',
                  fontWeight: '700',
                  color: '#000000',
                  textAlign: 'center',
                  marginBottom: '20px',
                  fontFamily: 'sans-serif',
                  letterSpacing: '-0.02em'
                }}>
                  Terms & Conditions
                </h1>

                {/* Updated Date - Left Aligned */}
                <div style={{ 
                  marginBottom: '40px',
                  textAlign: 'left'
                }}>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#333333',
                    margin: '0',
                    fontWeight: '400'
                  }}>
                    Updated on: {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Introduction */}
                <p style={{ 
                  marginBottom: '40px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  PLEASE READ THESE TERMS OF THIS USER AGREEMENT ("Agreement") ATTENTIVELY. BY ACCESSING THE SYPROPERTY WEBSITE OR UTILIZING SYPROPERTY SERVICES, YOU AGREE TO BE BOUND BY: 1) THIS SYPROPERTY USER AGREEMENT; AND 2) SYPROPERTY'S PRIVACY POLICY. IF YOU DISAGREE WITH THESE TERMS, DO NOT ACCESS THE SYPROPERTY WEBSITE OR UTILIZE SYPROPERTY SERVICES. THE HEADINGS IN THIS AGREEMENT ARE FOR REFERENCE ONLY. YOU SHOULD RETAIN A PRINTED COPY OF THIS AGREEMENT FOR YOUR RECORDS.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  1. Acceptance of Terms
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  By accessing and using SyProperty ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  2. Use License
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Permission is granted to temporarily download one copy of SyProperty per device for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul style={{ 
                  marginBottom: '30px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    modify or copy the materials
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    use the materials for any commercial purpose or for any public display
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    attempt to reverse engineer any software contained on SyProperty
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    remove any copyright or other proprietary notations from the materials
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  3. Property Listings and Information
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  SyProperty provides property listings and related information for informational purposes only. We do not guarantee the accuracy, completeness, or timeliness of any property information, including but not limited to:
                </p>
                <ul style={{ 
                  marginBottom: '30px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Property prices, availability, or condition
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Property descriptions, images, or specifications
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Agent contact information or credentials
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Legal status or ownership of properties
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  4. User Accounts and Responsibilities
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  When creating an account with SyProperty, you agree to:
                </p>
                <ul style={{ 
                  marginBottom: '30px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Provide accurate, current, and complete information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Maintain and update your account information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Keep your password secure and confidential
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Accept responsibility for all activities under your account
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Notify us immediately of any unauthorized use
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  5. Prohibited Uses
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  You may not use SyProperty:
                </p>
                <ul style={{ 
                  marginBottom: '30px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    For any unlawful purpose or to solicit others to perform unlawful acts
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of others
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To submit false or misleading information
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    To upload or transmit viruses or any other type of malicious code
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  6. Agent and Broker Services
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  SyProperty facilitates connections between users and real estate professionals. We are not a licensed real estate broker or agent. All real estate transactions are conducted directly between users and licensed professionals. We:
                </p>
                <ul style={{ 
                  marginBottom: '30px', 
                  paddingLeft: '20px',
                  listStyle: 'disc'
                }}>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Do not participate in real estate transactions
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Do not provide legal, financial, or tax advice
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Are not responsible for the actions of agents or brokers
                  </li>
                  <li style={{ 
                    marginBottom: '8px',
                    fontSize: '16px',
                    color: '#000000',
                    lineHeight: '1.6',
                    fontFamily: 'sans-serif'
                  }}>
                    Do not guarantee the performance of any real estate professional
                  </li>
                </ul>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  7. Intellectual Property Rights
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of SyProperty and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  8. Privacy Policy
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  9. Limitation of Liability
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  In no event shall SyProperty, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  10. Disclaimer
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, SyProperty excludes all representations, warranties, conditions and terms relating to our Service and the use of this Service.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  11. Governing Law
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which SyProperty operates, without regard to its conflict of law provisions.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  12. Changes to Terms
                </h2>
                <p style={{ 
                  marginBottom: '30px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>

                <h2 style={{ 
                  color: '#000000', 
                  marginBottom: '30px', 
                  fontSize: '24px',
                  fontWeight: '700',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  13. Contact Information
                </h2>
                <p style={{ 
                  marginBottom: '20px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  fontFamily: 'sans-serif'
                }}>
                  If you have any questions about these Terms and Conditions, please contact us at:
                </p>
                <div style={{ 
                  marginBottom: '40px',
                  fontSize: '16px',
                  color: '#000000',
                  lineHeight: '1.6',
                  fontFamily: 'sans-serif'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Email:</strong> legal@syproperty.com
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Phone:</strong> +1 (555) 123-4567
                  </p>
                  <p style={{ margin: '0' }}>
                    <strong>Address:</strong> 123 Property Street, Real Estate City, RE 12345
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        padding: '40px 0',
        borderTop: '1px solid #e5e5e5',
        marginTop: '60px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center'
        }}>
          {/* Footer Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <Link href="/" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              Home
            </Link>
            <Link href="/about" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              About Us
            </Link>
            <Link href="/contact" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              Contact
            </Link>
            <Link href="/terms-and-conditions" style={{
              fontSize: '14px',
              color: '#000000',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '600'
            }}>
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" style={{
              fontSize: '14px',
              color: '#666666',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              fontWeight: '400'
            }}>
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <div style={{
            fontSize: '14px',
            color: '#999999',
            fontFamily: 'sans-serif',
            fontWeight: '400'
          }}>
            © {new Date().getFullYear()} SyProperty. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .terms-content {
            padding: 20px 0 !important;
            max-width: 100% !important;
          }
          
          .terms-content h1 {
            font-size: 36px !important;
          }
          
          .terms-content h2 {
            font-size: 20px !important;
          }
          
          .terms-content p,
          .terms-content li {
            font-size: 15px !important;
          }

          header nav {
            gap: 20px !important;
          }

          header div:last-child {
            gap: 10px !important;
          }

          footer div:first-child {
            gap: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .terms-content h1 {
            font-size: 28px !important;
          }
          
          .terms-content h2 {
            font-size: 18px !important;
          }
          
          .terms-content p,
          .terms-content li {
            font-size: 14px !important;
          }

          header {
            padding: 15px 0 !important;
          }

          header div {
            flex-direction: column !important;
            gap: 15px !important;
          }

          header nav {
            gap: 15px !important;
          }

          footer div:first-child {
            flex-direction: column !important;
            gap: 15px !important;
          }
        }
      `}</style>
    </div>
  );
}
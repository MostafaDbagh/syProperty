"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DropdownSelect from "../common/DropdownSelect";
import { useAgents } from "@/apis/hooks";
import LocationLoader from "../common/LocationLoader";

export default function Agents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("All location");
  const [sortBy, setSortBy] = useState("Sort by (Default)");

  // Fetch agents from API
  const { data: agentsData, isLoading, isError, error } = useAgents();
  const agents = agentsData?.data || [];

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !searchTerm || 
      agent.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "All location" || 
      agent.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  // Sort agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case "Newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "Oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <section className="section-agent">
        <div className="tf-container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <LocationLoader 
                size="large" 
                message="Finding the best real estate agents for you..."
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section-agent">
        <div className="tf-container">
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="alert alert-danger">
                <h4>Error Loading Agents</h4>
                <p>{error?.message || "Failed to load agents. Please try again later."}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style jsx>{`
        .agent-item {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .agent-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
        }
        
        .image-wrap {
          position: relative;
          height: 250px;
          overflow: hidden;
        }
        
        .image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        
        .agent-item:hover .image-wrap img {
          transform: scale(1.08);
        }
        
        .content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .author h5.name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        
        .author h5.name a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .author h5.name a:hover {
          color: #007bff;
        }
        
        .author .text-2 {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .author .text-3 {
          color: #888;
          font-size: 14px;
          margin-bottom: 6px;
        }
        
        .author .text-3 i {
          margin-right: 5px;
          color: #007bff;
        }
        
        .cities-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        
        .city-tag {
          background: #f0f8ff;
          color: #007bff;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #e6f3ff;
        }
        
        .all-icons-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #f0f0f0;
        }
        
        .all-icons-section h6 {
          font-size: 14px;
          color: #666;
          margin-bottom: 12px;
          font-weight: 500;
        }
        
        .all-icons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        
        .btn-icon, .social-icon {
          width: 38px;
          height: 38px;
          background: #f8f9fa;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 14px;
          position: relative;
        }
        
        .btn-icon:hover, .social-icon:hover {
          background: #ff6b35;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }
        
        .phone-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
          margin-bottom: 8px;
        }
        
        .phone-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top-color: #333;
        }
        
        .btn-icon:hover .phone-tooltip {
          opacity: 1;
          visibility: visible;
        }
        
        .tf-grid-layout-2 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          padding: 20px 0;
        }
        
        @media (max-width: 1200px) {
          .tf-grid-layout-2 {
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
          }
        }
        
        @media (max-width: 992px) {
          .tf-grid-layout-2 {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
          }
        }
        
        @media (max-width: 768px) {
          .tf-grid-layout-2 {
            grid-template-columns: repeat(1, 1fr);
            gap: 20px;
          }
          
          .image-wrap {
            height: 250px;
          }
          
          .content {
            padding: 20px;
          }
        }
      `}</style>
    <section className="section-agent">
      <div className="tf-container">
        <div className="row">
          <div className="box-title style-2 mb-48">
            <h2>Our Agents</h2>
            <div className="wrap-sort">
              <form onSubmit={(e) => e.preventDefault()}>
                <fieldset>
                  <input
                    className=""
                    type="text"
                    placeholder="Search agent name or company"
                    name="name"
                    tabIndex={2}
                    aria-required="true"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </fieldset>
              </form>

              <DropdownSelect
                options={[
                  "All location",
                  "Latakia",
                  "Damascus",
                  "Aleppo",
                  "Homs",
                  "Hama",
                  "Idlib",
                  "Deir ez-Zor",
                  "Daraa",
                  "Tartous",
                ]}
                addtionalParentClass=""
                selectedValue={locationFilter}
                onChange={(value) => setLocationFilter(value)}
              />

              <DropdownSelect
                options={["Sort by (Default)", "Newest", "Oldest"]}
                addtionalParentClass="select-sort style-2"
                selectedValue={sortBy}
                onChange={(value) => setSortBy(value)}
              />
            </div>
          </div>
          
          {sortedAgents.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="alert alert-info">
                <h4>No Agents Found</h4>
                <p>No agents match your current search criteria. Try adjusting your filters.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="tf-grid-layout-2">
                {sortedAgents.map((agent) => (
                  <div key={agent._id} className="agent-item hover-img">
                    <div className="image-wrap">
                      <Link href={`/agents-details/${agent._id}`}>
                        <Image
                          className="lazyload"
                          alt={agent.fullName || "Agent"}
                          width={435}
                          height={250}
                          src={agent.avatar || "/images/avatar/agent-1.jpg"}
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                    <div className="content">
                      <div className="author">
                        <h5 className="name lh-30">
                          <Link href={`/agents-details/${agent._id}`}>
                            {agent.fullName || "Agent Name"}
                          </Link>
                        </h5>
                        <p className="text-2 lh-18">{agent.position || agent.job || "Real Estate Agent"}</p>
                        {agent.companyName && (
                          <p className="text-3 lh-18">
                            {agent.companyName}
                          </p>
                        )}
                        {agent.location && (
                          <div className="cities-tags">
                            {agent.location.split(',').map((city, index) => (
                              <span key={index} className="city-tag">
                                {city.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {(agent.phone || agent.email || agent.facebook || agent.twitter || agent.linkedin) && (
                        <div className="all-icons-section">
                          <h6>Contact & Follow</h6>
                          <div className="all-icons">
                            {agent.phone && (
                              <a href={`tel:${agent.phone}`} className="btn-icon" title="Call">
                                <i className="icon-phone-3" />
                                <span className="phone-tooltip">{agent.phone}</span>
                              </a>
                            )}
                            {agent.email && (
                              <a href={`mailto:${agent.email}`} className="btn-icon" title="Email">
                                <i className="icon-letter" />
                              </a>
                            )}
                            {agent.facebook && (
                              <a 
                                href={agent.facebook} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                title="Facebook"
                              >
                                <i className="icon-fb" />
                              </a>
                            )}
                            {agent.twitter && (
                              <a 
                                href={agent.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                title="Twitter"
                              >
                                <i className="icon-X" />
                              </a>
                            )}
                            {agent.linkedin && (
                              <a 
                                href={agent.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-icon"
                                title="LinkedIn"
                              >
                                <i className="icon-linked" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="wrap-pagination">
                <p className="text-1">
                  Showing {sortedAgents.length} of {agents.length} agents
                </p>
                {agents.length > 20 && (
                  <ul className="wg-pagination justify-center">
                    <li className="arrow">
                      <a href="#">
                        <i className="icon-arrow-left" />
                      </a>
                    </li>
                    <li className="active">
                      <a href="#">1</a>
                    </li>
                    <li className="arrow">
                      <a href="#">
                        <i className="icon-arrow-right" />
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
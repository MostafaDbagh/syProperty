"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DropdownSelect from "../common/DropdownSelect";
import { useAgents } from "@/apis/hooks";

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
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading agents...</span>
              </div>
              <p className="mt-3">Loading agents...</p>
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
                  "New York",
                  "Los Angeles",
                  "Chicago",
                  "Houston",
                  "Phoenix",
                  "Philadelphia",
                  "San Antonio",
                  "San Diego",
                  "Dallas",
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
              <div className="tf-grid-layout-2 lg-col-4 md-col-3 sm-col-2">
                {sortedAgents.map((agent) => (
                  <div key={agent._id} className="agent-item hover-img">
                    <div className="image-wrap">
                      <Link href={`/agents-details/${agent._id}`}>
                        <Image
                          className="lazyload"
                          alt={agent.fullName || "Agent"}
                          width={435}
                          height={585}
                          src={agent.avatar || "/images/avatar/agent-1.jpg"}
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                      <ul className="tf-social style-3">
                        <li>
                          <a 
                            href={agent.facebook || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={agent.facebook ? "Facebook" : "Facebook (Coming Soon)"}
                          >
                            <i className="icon-fb" />
                          </a>
                        </li>
                        <li>
                          <a 
                            href={agent.twitter || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={agent.twitter ? "Twitter" : "Twitter (Coming Soon)"}
                          >
                            <i className="icon-X" />
                          </a>
                        </li>
                        <li>
                          <a 
                            href={agent.linkedin || "#"} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            title={agent.linkedin ? "LinkedIn" : "LinkedIn (Coming Soon)"}
                          >
                            <i className="icon-linked" />
                          </a>
                        </li>
                        <li>
                          <a href="#" title="Instagram (Coming Soon)">
                            <i className="icon-ins" />
                          </a>
                        </li>
                      </ul>
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
                          <p className="text-3 lh-18" style={{ color: '#666', fontSize: '14px' }}>
                            {agent.companyName}
                          </p>
                        )}
                        {agent.location && (
                          <p className="text-3 lh-18" style={{ color: '#999', fontSize: '13px' }}>
                            <i className="icon-location me-1" />
                            {agent.location}
                          </p>
                        )}
                      </div>
                      <div className="wrap-btn-icon">
                        {agent.phone && (
                          <a href={`tel:${agent.phone}`} className="btn-icon" title="Call">
                            <i className="icon-phone-3" />
                          </a>
                        )}
                        {agent.email && (
                          <a href={`mailto:${agent.email}`} className="btn-icon" title="Email">
                            <i className="icon-letter" />
                          </a>
                        )}
                      </div>
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
  );
}
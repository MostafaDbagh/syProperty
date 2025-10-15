"use client";
import React from "react";
import { useMostVisitedListings } from "@/apis/hooks";

export default function MostVisitedTest() {
  const { 
    data: mostVisitedData, 
    isLoading, 
    error 
  } = useMostVisitedListings('68ef776e8cd8a7ccd23eedbd', { limit: 5 });

  console.log('MostVisitedTest Debug:', {
    mostVisitedData,
    isLoading,
    error
  });

  if (isLoading) {
    return <div>Loading most visited listings...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const listings = mostVisitedData?.data || [];

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Most Visited Test Component</h3>
      <p>Listings count: {listings.length}</p>
      {listings.length > 0 ? (
        <ul>
          {listings.map((listing) => (
            <li key={listing._id}>
              {listing.propertyId} - {listing.visitCount} visits
            </li>
          ))}
        </ul>
      ) : (
        <p>No listings found</p>
      )}
    </div>
  );
}

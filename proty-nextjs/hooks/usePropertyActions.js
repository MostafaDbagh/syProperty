import { useIncrementVisitCount } from "@/apis/hooks";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";

export const usePropertyActions = () => {
  const incrementVisitCount = useIncrementVisitCount();
  const router = useRouter();
  const visitedProperties = useRef(new Set());

  // Load visited properties from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('visitedProperties');
      if (stored) {
        const visitedSet = new Set(JSON.parse(stored));
        visitedProperties.current = visitedSet;
      }
    } catch (error) {
      console.log('Error loading visited properties:', error);
    }
  }, []);

  // Save visited properties to localStorage
  const saveVisitedProperties = (propertyId) => {
    try {
      visitedProperties.current.add(propertyId);
      localStorage.setItem('visitedProperties', JSON.stringify([...visitedProperties.current]));
    } catch (error) {
      console.log('Error saving visited properties:', error);
    }
  };

  const handleDetailsClick = (propertyId) => {
    // Only call visit API if not already visited
    if (!visitedProperties.current.has(propertyId)) {
      saveVisitedProperties(propertyId);
      incrementVisitCount.mutate(propertyId);
      console.log(`Visit API called for property: ${propertyId}`);
    } else {
      console.log(`Property ${propertyId} already visited, skipping API call`);
    }
    // Navigate to property detail page
    router.push(`/property-detail/${propertyId}`);
  };

  const handleQuickViewClick = (propertyId) => {
    // Only call visit API if not already visited
    if (!visitedProperties.current.has(propertyId)) {
      saveVisitedProperties(propertyId);
      incrementVisitCount.mutate(propertyId);
      console.log(`Visit API called for property: ${propertyId}`);
    } else {
      console.log(`Property ${propertyId} already visited, skipping API call`);
    }
    // You can add modal logic here for quick view
    console.log('Quick view clicked for property:', propertyId);
  };

  return {
    handleDetailsClick,
    handleQuickViewClick,
    isLoading: incrementVisitCount.isPending
  };
};

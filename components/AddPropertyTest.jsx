"use client";
import React, { useState } from "react";
import { useCreateListing } from "@/apis/hooks";

export default function AddPropertyTest() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const createListingMutation = useCreateListing();

  const testData = [
    {
      name: "Valid Property",
      data: {
        propertyType: "Apartment",
        propertyKeyword: "Luxury",
        propertyDesc: "Beautiful modern apartment",
        propertyPrice: 250000,
        status: "rent",
        rentType: "monthly",
        bedrooms: 3,
        bathrooms: 2,
        size: 1200,
        landArea: 1500,
        furnished: true,
        garages: false,
        address: "123 Test Street",
        country: "United States",
        state: "California",
        neighborhood: "Downtown",
        agent: "agent007",
        propertyId: `TEST_${Date.now()}`,
        amenities: ["Gym", "Pool"]
      },
      shouldPass: true
    },
    {
      name: "Missing Required Fields",
      data: {
        propertyType: "",
        propertyPrice: 250000,
        status: "",
        bedrooms: 3,
        bathrooms: 2,
        size: 1200,
        landArea: 1500,
        address: "",
        country: "",
        state: "",
        neighborhood: "",
        propertyId: ""
      },
      shouldPass: false
    },
    {
      name: "Invalid Price",
      data: {
        propertyType: "Apartment",
        propertyPrice: "invalid",
        status: "rent",
        bedrooms: 3,
        bathrooms: 2,
        size: 1200,
        landArea: 1500,
        address: "123 Test Street",
        country: "United States",
        state: "California",
        neighborhood: "Downtown",
        agent: "agent007",
        propertyId: `TEST_INVALID_${Date.now()}`
      },
      shouldPass: false
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results = [];

    for (const test of testData) {
      try {
        const result = await createListingMutation.mutateAsync(test.data);
        
        if (test.shouldPass) {
          results.push({
            name: test.name,
            status: "PASSED",
            message: `Property created successfully with ID: ${result._id || result.id}`,
            type: "success"
          });
        } else {
          results.push({
            name: test.name,
            status: "FAILED",
            message: "Should have failed but passed",
            type: "error"
          });
        }
      } catch (error) {
        if (!test.shouldPass) {
          results.push({
            name: test.name,
            status: "PASSED",
            message: `Correctly rejected: ${error.message}`,
            type: "success"
          });
        } else {
          results.push({
            name: test.name,
            status: "FAILED",
            message: `Should have passed but failed: ${error.message}`,
            type: "error"
          });
        }
      }
      
      // Update results progressively
      setTestResults([...results]);
    }

    setIsRunning(false);
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "success": return "text-green-600";
      case "error": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Property Functionality Test</h2>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isRunning ? "Running Tests..." : "Run Tests"}
        </button>
      </div>

      <div className="space-y-4">
        {testResults.map((result, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{result.name}</h3>
              <span className={`font-bold ${getStatusColor(result.type)}`}>
                {result.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{result.message}</p>
          </div>
        ))}
      </div>

      {testResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Test Summary:</h3>
          <p>
            Passed: {testResults.filter(r => r.status === "PASSED").length} / {testResults.length}
          </p>
          <p>
            Success Rate: {
              ((testResults.filter(r => r.status === "PASSED").length / testResults.length) * 100).toFixed(1)
            }%
          </p>
        </div>
      )}
    </div>
  );
}

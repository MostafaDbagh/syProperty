import React from "react";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export const metadata = {
  title: "Property Details || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};

export default async function page({ params }) {
  const { id } = await params;

  return <PropertyDetailClient id={id} />;
}

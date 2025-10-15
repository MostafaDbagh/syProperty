import Package from "@/components/dashboard/Package";
import RouteGuard from "@/components/common/RouteGuard";
import React from "react";

export const metadata = {
  title: "My Package || Proty - Real Estate React Nextjs Template",
  description: "Proty - Real Estate React Nextjs Template",
};
export default function page() {
  return (
    <RouteGuard requiredRole="user">
      <Package />
    </RouteGuard>
  );
}

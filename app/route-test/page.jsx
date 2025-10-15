import RouteProtectionTest from "@/components/RouteProtectionTest";
import React from "react";

export const metadata = {
  title: "Route Protection Test || Proty - Real Estate React Nextjs Template",
  description: "Test route protection system with different user roles",
};

export default function TestPage() {
  return (
    <>
      <RouteProtectionTest />
    </>
  );
}

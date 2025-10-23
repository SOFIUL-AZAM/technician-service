// src/components/dashboards/TechnicianDashboard.jsx
import React from "react";
import DashboardWrapper from "./DashboardWrapper";
import TechnicianProfile from "../profile/TechnicianProfile";

export default function TechnicianDashboard() {
  return (
    <DashboardWrapper title="Technician Dashboard">
      <TechnicianProfile />
    </DashboardWrapper>
  );
}

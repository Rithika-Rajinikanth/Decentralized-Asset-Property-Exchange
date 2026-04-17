// src/components/analytics/AnalyticsDashboard.jsx
import React from "react";
import Charts from "./Charts";
import Reports from "./Reports";

const AnalyticsDashboard = () => {
  return (
    <div>
      <h2>Platform Analytics Dashboard</h2>
      <Charts />
      <Reports />
    </div>
  );
};

export default AnalyticsDashboard;

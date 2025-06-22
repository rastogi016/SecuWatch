import React, { useState } from 'react';
import WindowsHandler from '../handlers/WindowsHandler';
import SeverityFilterBar from '../components/filters/SeverityFilterBar';
import TimeFilter from '../components/filters/TimeFilter';

const Windows = ({ alerts }) => {
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  const now = new Date();

  const filteredAlerts = alerts.filter((alert) => {
    const alertTime = new Date(alert.generated_at);

    const matchTime =
      selectedTimeRange === null ||
      (now - alertTime) / 60000 <= selectedTimeRange;

    const matchSeverity =
      selectedSeverity === "All" ||
      alert.severity?.toLowerCase() === selectedSeverity.toLowerCase();

    return matchTime && matchSeverity;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">Windows Alerts</h2>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between mb-8">
        <SeverityFilterBar
          selected={selectedSeverity}
          onSelect={setSelectedSeverity}
        />
        <TimeFilter
          selected={selectedTimeRange}
          onSelect={setSelectedTimeRange}
        />
      </div>
      
      <WindowsHandler alerts={filteredAlerts} />
    </div>
  );
};

export default Windows;

import React, { useState } from 'react';
import LinuxHandler from '../handlers/LinuxHandler';
import SeverityFilterDropdown from '../components/filters/SeverityFilterDropdown';
import TimeFilter from '../components/filters/TimeFilter';

const Linux = ({ alerts }) => {
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
      <h2 className="text-3xl font-bold text-center mb-4">Linux Alerts</h2>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between mb-8">
        <SeverityFilterDropdown
          selected={selectedSeverity}
          onSelect={setSelectedSeverity}
        />
        <TimeFilter
          selected={selectedTimeRange}
          onSelect={setSelectedTimeRange}
        />
      </div>
      
      <LinuxHandler alerts={filteredAlerts} />
    </div>
  );
};

export default Linux;

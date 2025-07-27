import React, { useState } from 'react';
import ApacheHandler from '../handlers/ApacheHandler';
import SeverityFilterDropdown from '../components/filters/SeverityFilterDropdown';
import TimeFilter from '../components/filters/TimeFilter';
import StatusFilterDropdown from '../components/filters/StatusFilterDropdown';
const Apache = ({ alerts }) => {
  const [selectedSeverity, setSelectedSeverity] = useState("All Severity");
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const now = new Date();

  const filteredAlerts = alerts.filter((alert) => {
    const alertTime = new Date(alert.generated_at);
    const matchTime = selectedTimeRange === null || (now - alertTime) / 60000 <= selectedTimeRange;

    const matchSeverity = selectedSeverity === "All Severity" || alert.severity?.toLowerCase() === selectedSeverity.toLowerCase();

    const matchStatus = selectedStatus === "All Status" || alert.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchTime && matchSeverity && matchStatus;
  });

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-4">Apache Alerts</h2>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-3">
        <SeverityFilterDropdown
          selected={selectedSeverity}
          onSelect={setSelectedSeverity}
        />
        <StatusFilterDropdown
          selected={selectedStatus}
          onSelect={setSelectedStatus}
        />
        <TimeFilter
          selected={selectedTimeRange}
          onSelect={setSelectedTimeRange}
        />
      </div>
      <ApacheHandler alerts={filteredAlerts} />
    </div>
  );
};

export default Apache;

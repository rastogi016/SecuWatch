import React, { useState, useEffect } from 'react';
import ApacheHandler from '../handlers/ApacheHandler';
import SeverityFilterDropdown from '../components/filters/SeverityFilterDropdown';
import TimeFilter from '../components/filters/TimeFilter';
import StatusFilter from '../components/filters/StatusFilter';


const Apache = ({ alerts }) => {
  const [alertList, setAlertList] = useState(alerts || []);
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Debug log to see what alerts are passed in
  useEffect(() => {
    console.log("Apache alerts:", alerts);
    setAlertList(alerts || []);
  }, [alerts]);

  const handleStatusUpdate = (id, newStatus) => {
    setAlertList((prev) =>
      prev.map((alert) =>
        alert.alert_id === id ? { ...alert, status: newStatus } : alert
      )
    );
  };

  // Restore filter logic for severity, status, and time
  const filteredAlerts = alertList.filter((alert) => {
    const now = new Date();
    const alertTime = new Date(alert.generated_at);

    // Time filter (minutes ago)
    const matchTime =
      selectedTimeRange === null ||
      (now - alertTime) / 60000 <= selectedTimeRange;

    // Severity filter
    const matchSeverity =
      selectedSeverity === "All" ||
      (alert.severity?.toLowerCase() === selectedSeverity.toLowerCase());

    // Status filter
    const matchStatus =
      selectedStatus === "All" ||
      (alert.status?.toLowerCase() === selectedStatus.toLowerCase());

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
        <StatusFilter selected={selectedStatus} onSelect={setSelectedStatus} />
        <TimeFilter selected={selectedTimeRange} onSelect={setSelectedTimeRange} />
      </div>

      <ApacheHandler alerts={filteredAlerts} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default Apache;

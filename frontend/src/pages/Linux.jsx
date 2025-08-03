import React, { useState, useEffect } from 'react';
import LinuxHandler from '../handlers/LinuxHandler';
import SeverityFilterDropdown from '../components/filters/SeverityFilterDropdown';
import StatusFilter from '../components/filters/StatusFilter';
import TimeFilter from '../components/filters/TimeFilter';

function ErrorBoundary({ error }) {
  if (!error) return null;
  return (
    <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">
      <strong>Error:</strong> {error}
    </div>
  );
}

const Linux = ({ alerts }) => {
  const [alertList, setAlertList] = useState(alerts || []);
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setAlertList(alerts || []);
    } catch (e) {
      setError(e.message || String(e));
    }
  }, [alerts]);

  const handleStatusUpdate = (id, newStatus) => {
    try {
      setAlertList((prev) =>
        prev.map((alert) =>
          alert.alert_id === id ? { ...alert, status: newStatus } : alert
        )
      );
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  let filteredAlerts = [];
  try {
    filteredAlerts = alertList.filter((alert) => {
      const now = new Date();
      const alertTime = new Date(alert.generated_at);

      const matchTime =
        selectedTimeRange === null ||
        (now - alertTime) / 60000 <= selectedTimeRange;

      const matchSeverity =
        selectedSeverity === "All" ||
        (alert.severity?.toLowerCase() === selectedSeverity.toLowerCase());

      const matchStatus =
        selectedStatus === "All" ||
        (alert.status?.toLowerCase() === selectedStatus.toLowerCase());

      return matchTime && matchSeverity && matchStatus;
    });
  } catch (e) {
    setError(e.message || String(e));
  }

  return (
    <div>
      <ErrorBoundary error={error} />
      <h2 className="text-3xl font-bold text-center mb-4">Linux Alerts</h2>
      <div className="flex flex-wrap items-center justify-between mb-8 gap-3">
        <SeverityFilterDropdown
          selected={selectedSeverity}
          onSelect={setSelectedSeverity}
        />
        <StatusFilter selected={selectedStatus} onSelect={setSelectedStatus} />
        <TimeFilter selected={selectedTimeRange} onSelect={setSelectedTimeRange} />
      </div>
      <LinuxHandler alerts={filteredAlerts} onStatusUpdate={handleStatusUpdate} />
    </div>
  );
};

export default Linux;

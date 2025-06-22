// pages/Analytics.jsx
import React, { useState } from "react";
import SourceFilter from "../components/filters/SourceFilter";
import TimeFilter from "../components/filters/TimeFilter";
import AlertsLineChart from "../components/charts/AlertsLineChart";
import SeverityPieChart from "../components/charts/SeverityPieChart";
import TopIPBarChart from "../components/charts/TopIPBarChart";

const Analytics = ({ alerts }) => {
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  const allAlerts = [
    ...(alerts.apache || []),
    ...(alerts.windows || []),
    ...(alerts.linux || [])
  ];

  const now = new Date();

  const filteredAlerts = allAlerts.filter(alert => {
    const matchSource = selectedSource === "All" ||
      alert.source?.toLowerCase() === selectedSource.toLowerCase();

    const matchTime = !selectedTimeRange || (() => {
      const alertTime = new Date(alert.generated_at);
      const diffMs = now.getTime() - alertTime.getTime();
      const diffMin = diffMs / 60000;
      return diffMin <= selectedTimeRange;
    })();

    return matchSource && matchTime;
  });

  const timeSeriesMap = new Map();
  filteredAlerts.forEach(alert => {
    const minute = new Date(alert.generated_at)
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    timeSeriesMap.set(minute, (timeSeriesMap.get(minute) || 0) + 1);
  });
  const alertsOverTime = Array.from(timeSeriesMap.entries())
    .map(([time, count]) => ({ time, count }));

  const severityMap = new Map();
  filteredAlerts.forEach(alert => {
    const sev = alert.severity?.toLowerCase() || "unknown";
    severityMap.set(sev, (severityMap.get(sev) || 0) + 1);
  });
  const severityData = Array.from(severityMap.entries())
    .map(([name, value]) => ({ name, value }));

  const ipMap = new Map();
  filteredAlerts.forEach(alert => {
    if (alert.ip) {
      ipMap.set(alert.ip, (ipMap.get(alert.ip) || 0) + 1);
    }
  });
  const topIPs = Array.from(ipMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ip, count]) => ({ ip, count }));

  return (
    <div className="space-y-12 pb-10">
      <h2 className="text-3xl font-bold text-center mt-2 font-inter">
        Threat Analytics
      </h2>

      <div  className="flex flex-wrap items-center justify-between mb-8">
        <SourceFilter selected={selectedSource} onSelect={setSelectedSource} />
        <TimeFilter selected={selectedTimeRange} onSelect={setSelectedTimeRange} />
      </div>

      <AlertsLineChart data={alertsOverTime} />
      <SeverityPieChart data={severityData} />
      <TopIPBarChart data={topIPs} />
    </div>
  );
};

export default Analytics;

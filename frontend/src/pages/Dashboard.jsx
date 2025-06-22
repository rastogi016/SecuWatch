import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const Dashboard = ({ alerts }) => {
  const [now, setNow] = useState(new Date());

  // Update current time every 5 seconds to trigger re-render
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(interval);
  }, []);

  const severityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case "critical": return "bg-red-800";
      case "high": return "bg-orange-700";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const allAlerts = [...alerts.apache, ...alerts.windows, ...alerts.linux]
    .sort((a, b) => new Date(b.generated_at) - new Date(a.generated_at));

  const liveFeedAlerts = allAlerts.filter(
    a => now - new Date(a.generated_at) <= 6 * 60 * 60 * 1000 // 6hr
  );

  const tableAlerts = allAlerts.filter(
    a => now - new Date(a.generated_at) <= 24 * 60 * 60 * 1000 // 24 hr
  );

  return (
    <div className="px-6 space-y-6 min-h-screen mb-10">
      <h1 className="text-3xl font-bold text-white text-center">Dashboard Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Alerts" value={allAlerts.length}/>
        <StatCard label="Critical" value={allAlerts.filter(a => a.severity === 'critical').length} color="bg-red-800" />
        <StatCard label="High" value={allAlerts.filter(a => a.severity === 'high').length} color="bg-orange-700" />
        <StatCard label="Medium" value={allAlerts.filter(a => a.severity === 'medium').length} color="bg-yellow-500" />
      </div>

      {/* Live Feed */}
      <div className="bg-gray-900 rounded-xl p-4 shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Live Alert Feed</h2>
        <ul className="space-y-3 max-h-64 overflow-y-auto">
          {liveFeedAlerts.length === 0 ? (
            <li className="text-gray-400">No alerts in the last 6hrs.</li>
          ) : (
            liveFeedAlerts.map((alert, i) => (
              <li key={i} className="text-white flex gap-4 items-center">
                <div className={`w-3 h-3 rounded-full ${severityColor(alert.severity)}`} />
                <span className="font-medium capitalize">{alert.source}</span>
                <span>{alert.alert_type}</span>
                <span className="text-sm text-gray-400">{formatDistanceToNow(new Date(alert.generated_at), { addSuffix: true })}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Recent Alerts Table */}
      <div className="bg-gray-900 rounded-xl p-5 shadow">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Alerts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Time</th>
                <th className="px-2">Source</th>
                <th className="px-2">Type</th>
                <th className="px-2">IP</th>
                <th className="px-2">Severity</th>
              </tr>
            </thead>
            <tbody>
              {tableAlerts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-4">
                    No alerts in the last 24 hrs.
                  </td>
                </tr>
              ) : (
                tableAlerts.map((alert, i) => (
                  <tr key={i} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-2 text-sm capitalize">{new Date(alert.generated_at).toLocaleTimeString()}</td>
                    <td className="capitalize px-2">{alert.source}</td>
                    <td className="capitalize px-2">{alert.alert_type}</td>
                    <td className="capitalize px-2">{alert.ip}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-sm ${severityColor(alert.severity)}`}>{alert.severity}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "bg-gray-800" }) => (
  <div className={`rounded-xl p-4 text-white ${color} shadow-md`}>
    <p className="text-sm font-semibold">{label}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default Dashboard;

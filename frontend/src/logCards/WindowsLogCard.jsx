import React, { useState } from "react";
import axios from "axios";

function ErrorDisplay({ error }) {
  if (!error) return null;
  return (
    <div className="bg-red-100 text-red-800 p-2 mb-2 rounded">
      <strong>Error:</strong> {error}
    </div>
  );
}

const WindowsLogCard = ({ alert, onStatusUpdate }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [status, setStatus] = useState(alert.status || "New");
  const [error, setError] = useState(null);

  const {
    alert_id,
    severity,
    source,
    ip,
    user,
    generated_at,
    raw_log
  } = alert;

  const severityLabels = {
    critical: "🔴 Critical",
    high: "🟠 High",
    medium: "🟡 Medium",
    low: "🟢 Low"
  };

  const formattedLog = `
━━━━━━━━━━━━━━━━━━━━━━
 User:        ${user}
 IP Address:  ${ip}
 Time:        ${new Date(generated_at).toLocaleString()}
 Severity:    ${severityLabels[severity?.toLowerCase()] || severity}
 Source:      ${source?.toUpperCase()}
 Alert ID:    ${alert_id}
━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await axios.patch(
        `http://localhost:8000/alerts/${alert.source}/${alert.alert_id}/status`,
        { status: newStatus },
      );
      onStatusUpdate(alert.alert_id, newStatus);
    } catch (error) {
      setError('Failed to update status: ' + (error.message || String(error)));
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-white mb-4 space-y-4">
      <ErrorDisplay error={error} />
      {/* Header and Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-semibold">{alert.alert_type}</h2>
        <div className="flex gap-2 items-center">

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={handleStatusChange}
            className="px-2 py-1 text-sm bg-gray-700 text-white rounded border border-gray-500"
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Show Raw Alert */}
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1 text-sm bg-purple-900 hover:bg-purple-600 text-gray-300 hover:text-white rounded transition"
          >
            {showRaw ? "Hide Raw Log" : "Show Raw Log"}
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Formatted Alert */}
        <div className="bg-gray-900 p-4 rounded-md flex-1 font-mono whitespace-pre-wrap text-sm text-green-200">
          {formattedLog}
        </div>

        {/* Raw Log */}
        {showRaw && (
          <div className="bg-black p-4 rounded-md flex-1 font-mono text-sm text-gray-200 border border-gray-700 max-h-60 overflow-y-auto overflow-x-auto max-w-full">
            <span className="block text-yellow-400 font-semibold mb-2">Raw Log</span>
            <pre className="whitespace-pre-wrap break-words">
              <code className="break-all">
                {raw_log ? JSON.stringify(raw_log, null, 2) : "No raw log available."}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindowsLogCard;

import React, { useState } from "react";
import axios from "axios";

function ErrorDisplay({ error }) {
  if (!error) return null;
  return (
    <div className="bg-red-100 text-red-800 p-2 mb-2 rounded">
      <strong>Error:</strong> {error}
    </div>
  );
};

const LinuxLogCard = ({ alert, onStatusUpdate }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [showCTI, setShowCTI] = useState(false);
  const [status, setStatus] = useState(alert.status || "New");
  const [error, setError] = useState(null);

  let alert_id, severity, source, ip, user, generated_at, raw_log, cti;
  try {
    ({ alert_id, severity, source, ip, user, generated_at, raw_log, cti } = alert);
  } catch (e) {
    setError("Invalid alert object: " + (e.message || String(e)));
  }

  const severityLabels = {
    critical: "🔴 Critical",
    high: "🟠 High",
    medium: "🟡 Medium",
    low: "🟢 Low"
  };

  // Fallbacks for missing/invalid data
  const displayUser = user || "Unknown";
  const displayIP = ip || "Unknown";
  const displaySeverity = severityLabels[severity?.toLowerCase()] || severity || "Unknown";
  const displaySource = source?.toUpperCase() || "LINUX";
  const displayAlertId = alert_id || "Unknown";
  let displayTime = "N/A";
  if (generated_at) {
    const dateObj = new Date(generated_at);
    displayTime = isNaN(dateObj.getTime()) ? "N/A" : dateObj.toLocaleString();
  }

  const formattedLog = `
━━━━━━━━━━━━━━━━━━━━━━
 User:         ${displayUser}
 IP Address:   ${displayIP}
 Time:         ${displayTime}
 Severity:     ${displaySeverity}
 Source:       ${displaySource}
 Alert ID:     ${displayAlertId}
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
    } catch (err) {
      setError('Failed to update status: ' + (err.message || String(err)));
      console.error('Failed to update status:', err);
    }
  };

  const ipLookup = cti?.ip_lookup;
  // If all fields are unknown, don't render the card
  const allUnknown = [displayUser, displayIP, displayTime, displaySeverity, displaySource, displayAlertId]
    .every(val => ["Unknown", "N/A", "LINUX"].includes(val));
  if (allUnknown) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-white space-y-4 mb-4">
      <ErrorDisplay error={error} />
      {/* Header and Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-semibold">{ alert.alert_type }</h2>
        <div className="flex gap-2 items-center">
          <select
            value={status}
            onChange={handleStatusChange}
            className="px-2 py-1 text-sm bg-gray-700 text-white rounded border border-gray-500"
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1 text-sm bg-purple-900 hover:bg-purple-600 text-gray-300 hover:text-white rounded transition"
          >
            {showRaw ? "Hide Raw Log" : "Show Raw Log"}
          </button>
          <button
            onClick={() => setShowCTI(!showCTI)}
            className="px-3 py-1 text-sm bg-purple-900 hover:bg-purple-600 text-gray-300 hover:text-white rounded transition"
          >
            {showCTI ? "Hide CTI Info" : "Show CTI Info"}
          </button>
        </div>
      </div>
      {/* Responsive Flex Row on md+, Column on small screens */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Formatted Info */}
        <div className="bg-gray-900 p-4 rounded-md font-mono whitespace-pre-wrap text-sm text-green-200 flex-1">
          {formattedLog}
        </div>
        {/* Raw Log */}
        {showRaw && (
          <div className="bg-black p-4 rounded-md font-mono text-sm text-gray-200 overflow-auto max-h-60 border border-gray-700 flex-1">
            <span className="block text-yellow-400 font-semibold mb-2">Raw Log</span>
            <code>{raw_log || "No raw log available."}</code>
          </div>
        )}
        {/* CTI Info */}
        {showCTI && (ipLookup) && (
          <div className="bg-gray-900 p-4 rounded-md border border-gray-700 text-sm text-gray-300 flex-1 overflow-auto max-h-96">
            <h3 className="text-md font-semibold text-purple-400 mb-3">🧠 Threat Intelligence</h3>
            {/* IP Info */}
            {ipLookup && (
              <div className="mb-4">
                <p className="text-sm mb-1"> <strong>IP Lookup</strong></p>
                <ul className="list-disc list-inside">
                  <li><strong>Abuse Confidence:</strong> {ipLookup.abuseConfidenceScore}</li>
                  <li><strong>Total Reports:</strong> {ipLookup.totalReports}</li>
                  <li><strong>Last Reported:</strong> {ipLookup.lastReportedAt || "N/A"}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LinuxLogCard;

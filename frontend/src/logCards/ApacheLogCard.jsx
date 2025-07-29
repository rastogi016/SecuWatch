import React, { useState, useEffect } from "react";
import axios from "axios";

const ApacheLogCard = ({ alert, onStatusUpdate }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [showCTI, setShowCTI] = useState(false);
  const [status, setStatus] = useState(alert.status || "New");

  const {
    alert_id,
    alert_type,
    severity,
    ip,
    method,
    path,
    status_code,
    generated_at,
    raw_log,
    source,
    cti
  } = alert;

  const severityLabels = {
    critical: "🔴 Critical",
    high: "🟠 High",
    medium: "🟡 Medium",
    low: "🟢 Low"
  };

  const formattedLog = `
━━━━━━━━━━━━━━━━━━━━━━
 IP Address:   ${ip}
 Method:       ${method}
 Path:         ${path}
 Status Code:  ${status_code}
 Time:         ${new Date(generated_at).toLocaleString()}
 Severity:     ${severityLabels[severity?.toLowerCase()] || severity}
 Source:       ${source?.toUpperCase()}
 Alert ID:     ${alert_id}
━━━━━━━━━━━━━━━━━━━━━━
`.trim();

  const ipLookup = cti?.ip_lookup;
  const urlLookup = cti?.url_lookup;


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
        console.error('Failed to update status:', error);
      } finally {
      }
    console.log('Updating status for', alert.source, alert.alert_id, '→', newStatus);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 text-white space-y-4 mb-4">
      {/* Header and Buttons */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg font-semibold">{alert_type}</h2>
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

          {/* Show Cti Info */}
          <button
            onClick={() => setShowCTI(!showCTI)}
            className="px-3 py-1 text-sm bg-purple-900 hover:bg-purple-600 text-gray-300 hover:text-white rounded transition"
          >
            {showCTI ? "Hide CTI Info" : "Show CTI Info"}
          </button>
        </div>
      </div>

      {/* Flex Layout */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-gray-900 p-4 rounded-md font-mono whitespace-pre-wrap text-sm text-green-200 flex-1">
          {formattedLog}
        </div>

        {showRaw && (
          <div className="bg-black p-4 rounded-md font-mono text-sm text-gray-200 overflow-auto max-h-96 border border-gray-700 flex-1">
            <span className="block text-yellow-400 font-semibold mb-2">Raw Log</span>
            <code>{raw_log || "No raw log available."}</code>
          </div>
        )}

        {showCTI && (ipLookup || urlLookup) && (
          <div className="bg-gray-900 p-4 rounded-md border border-gray-700 text-sm text-gray-300 flex-1 overflow-auto max-h-96">
            <h3 className="text-md font-semibold text-purple-400 mb-3">🧠 Threat Intelligence</h3>
            {ipLookup && (
              <div className="mb-4">
                <p className="text-sm mb-1"><strong>IP Lookup</strong></p>
                <ul className="list-disc list-inside">
                  <li><strong>Abuse Confidence:</strong> {ipLookup.abuseConfidenceScore}</li>
                  <li><strong>Total Reports:</strong> {ipLookup.totalReports}</li>
                  <li><strong>Last Reported:</strong> {ipLookup.lastReportedAt || "N/A"}</li>
                </ul>
              </div>
            )}
            {urlLookup && (
              <div>
                <p className="text-sm mb-1"><strong>URL Lookup</strong></p>
                <ul className="list-disc list-inside">
                  <li><strong>Malicious:</strong> {urlLookup.malicious}</li>
                  <li><strong>Suspicious:</strong> {urlLookup.suspicious}</li>
                  <li><strong>Harmless:</strong> {urlLookup.harmless}</li>
                  <li><strong>Categories:</strong>
                    <ul className="ml-4 list-disc">
                      {Object.entries(urlLookup.categories || {}).map(([vendor, verdict]) => (
                        <li key={vendor}>{vendor}: {verdict}</li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApacheLogCard;

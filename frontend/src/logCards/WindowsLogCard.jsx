import React, { useState } from "react";

const WindowsLogCard = ({ alert }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [showCTI, setShowCTI] = useState(false);

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
 Severity:    ${severityLabels[severity?.toLowerCase()] || Unknown}
 Source:      ${source?.toUpperCase()}
 Alert ID:    ${alert_id}
━━━━━━━━━━━━━━━━━━━━━━
`.trim();
  // const hashLookup = cti

  return (
      <div className="bg-gray-800 rounded-lg p-4 text-white mb-4">
        {/* Header with Toggle Button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">{alert.alert_type}</h2>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="px-3 py-1 text-sm bg-purple-950 hover:bg-purple-600 rounded transition text-gray-400 hover:text-white"
          >
            {showRaw ? "Hide Raw Log" : "Show Raw Log"}
          </button>
          
        </div>

        {/* Content Container */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Formatted Alert */}
          <div className="bg-gray-900 p-4 rounded-md flex-1 font-mono whitespace-pre-wrap text-sm text-green-200">
            {formattedLog}
          </div>

          {/* Raw Log */}
          {showRaw && (
            <div className="bg-black p-4 rounded-md flex-1 font-mono text-sm text-gray-200 overflow-auto max-h-60 border border-gray-700">
              <span className="block text-yellow-400 font-semibold mb-2">Raw Log</span>
              <code className="whitespace-pre-wrap break-words">
                {raw_log ? JSON.stringify(raw_log, null, 2) : "No raw log available."}
              </code>
            </div>
          )}
        </div>
      </div>
  );
};

export default WindowsLogCard;

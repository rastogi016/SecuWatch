import React, { useState } from "react";

const getSeverityStyles = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-red-200',
        text: 'text-red-800',
        border: 'border-red-500'
      };
    case 'high':
      return {
        bg: 'bg-orange-200',
        text: 'text-orange-800',
        border: 'border-orange-500'
      };
    case 'medium':
      return {
        bg: 'bg-yellow-200',
        text: 'text-yellow-800',
        border: 'border-yellow-500'
      };
    case 'low':
      return {
        bg: 'bg-blue-200',
        text: 'text-blue-800',
        border: 'border-blue-500'
      };
    case 'info':
    default:
      return {
        bg: 'bg-gray-200',
        text: 'text-gray-800',
        border: 'border-gray-400'
      };
  }
};

const AlertCard = ({ alert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { bg, text, border } = getSeverityStyles(alert.severity);

  return (
    <div
      className={`rounded-md mb-2 cursor-pointer transition-shadow duration-150 hover:shadow-md ${bg} ${text} ${isOpen ? '' : `border-l-4 ${border}`}`}
      onClick={() => setIsOpen(!isOpen)}
      role="button"
      aria-expanded={isOpen}
    >
      <div className="flex justify-between items-center px-4 py-2 mt-3">
        <div className="font-medium">{alert.alert_type}</div>
        <div className="text-sm">IP: {alert.ip || 'unknown'}</div>
      </div>

      {isOpen && (
        <div className={`px-4 py-2 border-t border-white text-sm`}>
          <pre className="whitespace-pre-wrap break-words text-xs overflow-x-auto text-black">
            {JSON.stringify(alert, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AlertCard;

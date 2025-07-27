import React from "react";

const severities = ["All Severity", "Critical", "High", "Medium", "Low", "Info"];

const SeverityFilterDropdown = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-center mt-6 mb-6 font-inter">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="px-4 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-700"
      >
        {severities.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeverityFilterDropdown;

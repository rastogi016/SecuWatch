import React from "react";

const severities = ["All", "Critical", "High", "Medium", "Low", "Info"];

const SeverityFilterDropdown = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-center mt-6 mb-6 font-inter">
      <label htmlFor="Severity-filter" className="mr-2 font-semibold">
        Severity:
      </label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="px-2 py-1 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-700"
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

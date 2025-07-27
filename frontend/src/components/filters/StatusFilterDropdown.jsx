import React from "react";

const statuses = ["All Status", "New", "In Progress", "Resolved"];

const StatusFilterDropdown = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-center mt-6 mb-6 font-inter">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="px-4 py-2 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-700"
      >
        {statuses.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusFilterDropdown;

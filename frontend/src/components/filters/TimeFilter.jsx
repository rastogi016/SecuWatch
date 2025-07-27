import React from "react";

const timeRanges = [
  { label: "All Time", minutes: null },
  { label: "Last 5 mins", minutes: 5 },
  { label: "Last 15 mins", minutes: 15 },
  { label: "Last 30 mins", minutes: 30 },
  { label: "Last 1 hour", minutes: 60 },
  { label: "Last 6 hours", minutes: 360 },
  { label: "Last 12 hours", minutes: 720 },
  { label: "Last 24 hours", minutes: 1440 },
];

const TimeFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-center my-2 ml-auto">
      <select
        value={selected === null ? "null" : selected}
        onChange={(e) => {
          const val = e.target.value;
          onSelect(val === "null" ? null : parseInt(val));
        }}
        className="bg-gray-800 text-white text-sm border border-gray-600 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 hover:bg-gray-700 hover:border-purple-600 transition-colors"
      >
        {timeRanges.map(({ label, minutes }) => (
          <option key={label} value={minutes === null ? "null" : minutes}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};


export default TimeFilter;

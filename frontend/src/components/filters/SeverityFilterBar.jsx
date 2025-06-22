import React from "react";

const severities = ["All", "Critical", "High", "Medium", "Low", "Info"];

const SeverityFilterBar = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-6 mt-6 font-inter">
      {severities.map((level) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          className={`px-4 py-1 rounded-full border transition-all duration-200
            ${
              selected === level
                ? "bg-purple-800 text-white"
                : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
            }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default SeverityFilterBar;

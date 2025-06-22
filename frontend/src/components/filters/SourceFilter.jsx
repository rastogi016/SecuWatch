import React from "react";

const sources = ["All", "Apache", "Windows", "Linux"];

const SourceFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 flex-wrap justify-center mb-6 mt-6 font-inter">
      {sources.map((source) => (
        <button
          key={source}
          onClick={() => onSelect(source)}
          className={`px-4 py-1 rounded-full border transition-all duration-200 ${
            selected === source
              ? "bg-purple-800 text-white border-purple-800"
              : "bg-gray-800 text-gray-200 border-gray-600 hover:bg-gray-700"
          }`}
        >
          {source}
        </button>
      ))}
    </div>
  );
};

export default SourceFilter;

const statuses = ["All", "New", "In Progress", "Resolved"];

const StatusFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex justify-center mt-6 mb-6 font-inter">
      <label htmlFor="status-filter" className="mr-2 font-semibold">
        Status:
      </label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="px-2 py-1 rounded-md bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-700">
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusFilter;

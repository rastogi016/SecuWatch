import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  critical: "#dc2626",
  high: "#f97316",
  medium: "#facc15",
  low: "#10b981",
  info: "#3b82f6",
  unknown: "#6837EC",
};

const SeverityPieChart = ({ data, title = "Severity Breakdown" }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {
      data.length === 0 ? (
          <div className="text-center text-gray-400 py-9">
              No alert activity in the selected time range.
          </div>
      ) : (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  label
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || COLORS.unknown}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )
      }
  </div>
);

export default SeverityPieChart;

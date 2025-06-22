import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AlertsLineChart = ({ data, title = "Alerts Over Time" }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {
        data.length === 0 ? (
            <div className="text-center text-gray-400 py-9">
                No alert activity in the selected time range.
            </div>
        ) : (
            <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={2} />
            </LineChart>
            </ResponsiveContainer>
        )    
    }
  </div>
);

export default AlertsLineChart;
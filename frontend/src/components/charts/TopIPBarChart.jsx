import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TopIPBarChart = ({ data, title = "Top Malicious IPs" }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {
      data.length === 0 ? (
          <div className="text-center text-gray-400 py-9" >
              No alert activity in the selected time range.
          </div>
      ) : (
            <ResponsiveContainer width="90%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="ip" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#e11d48" />
            </BarChart>
            </ResponsiveContainer>
          )
    }
  </div>
);

export default TopIPBarChart;
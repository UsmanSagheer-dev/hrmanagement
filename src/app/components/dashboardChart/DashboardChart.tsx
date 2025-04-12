import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { RiArrowDropDownLine } from "react-icons/ri";
import Button from "../button/Button";
export default function AttendanceOverview() {
  const [selectedDay, setSelectedDay] = useState("All");

  const data = [
    { name: "Mon", high: 10, medium: 20, low: 70 },
    { name: "Tue", high: 15, medium: 25, low: 60 },
    { name: "Wed", high: 20, medium: 30, low: 50 },
    { name: "Thu", high: 10, medium: 20, low: 70 },
    { name: "Fri", high: 15, medium: 25, low: 60 },
    { name: "Sat", high: 20, medium: 30, low: 50 },
    { name: "Sun", high: 10, medium: 20, low: 70 },
  ];

  const displayData =
    selectedDay === "All"
      ? data
      : data.filter((day) => day.name === selectedDay);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-gray-700 p-3 rounded-md">
          <p className="font-bold text-white">{`${label}`}</p>
          <p className="text-pink-500">{`High: ${payload[0].value}%`}</p>
          <p className="text-yellow-400">{`Medium: ${payload[1].value}%`}</p>
          <p className="text-orange-500">{`Low: ${payload[2].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-transparent text-white p-6 rounded-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Attendance Overview</h2>
        <div className="flex gap-4">
          <select
            className="bg-transparent border border-gray-700 text-white px-4 py-2 rounded-md"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="All">All Days</option>
            {data.map((day) => (
              <option key={day.name} value={day.name}>
                {day.name}
              </option>
            ))}
          </select>
          <Button
            icon={RiArrowDropDownLine}
            title="Today"
            className="bg-transparent border border-gray-700 text-white px-4 py-2 rounded-md flex flex-row-reverse items-center justify-center "
            onClick={() => setSelectedDay("All")}
          />
        </div>
      </div>

      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%" background="#131313">
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "#9CA3AF" }}
            />
            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="low"
              stackId="a"
              fill="#F97316"
              radius={[30, 30, 30, 30]}
            />

            <Bar
              dataKey="medium"
              stackId="a"
              fill="#FBBF24"
              radius={[30, 30, 30, 30]}
            />
            <Bar
              dataKey="high"
              stackId="a"
              fill="#F45B69"
              radius={[30, 30, 30, 30]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

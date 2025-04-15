import { StatsCardProps } from "@/app/types/types";
import React, { JSX } from "react";
import { FaUsers, FaUser, FaCalendarCheck, FaFolder } from "react-icons/fa"; 


const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  percentage,
  percentageColor,
  updateDate,
}) => {
  const renderIcon = () => {
    const iconMap: { [key: string]: JSX.Element } = {
      "Total Employee": <FaUsers className="text-orange-500" size={24} />,
      "Total Applicant": <FaUser className="text-orange-500" size={24} />,
      "Today Attendance": (
        <FaCalendarCheck className="text-orange-500" size={24} />
      ),
      "Total Projects": <FaFolder className="text-orange-500" size={24} />,
    };

    return iconMap[title] || <FaUser className="text-orange-500" size={24} />;
  };

  return (
    <div className="bg-transparent border border-[#A2A1A833] text-white rounded-lg  flex flex-col space-y-2 w-full">
      <div className="p-4 ">
        <div className="flex items-center gap-4">
          <div className="bg-[#E253190D] w-[65px] h-[40px] rounded flex items-center justify-center">
            {renderIcon()}
          </div>

          <h2 className="text-sm font-light">{title}</h2>
        </div>
        <div className=" flex items-center justify-between">
          <p className="text-4xl font-bold">{value}</p>
          <div>
            <span
              className={`text-sm flex items-center space-x-1 ${
                percentageColor === "green" ? "text-green-500" : "text-red-500"
              }`}
            >
              <span>
                {percentageColor === "green" ? "▲" : "▼"} {percentage}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[1px] bg-[#A2A1A833]"></div>

      <div className="flex justify-between items-center p-4">
        <p className="text-xs text-gray-400">{updateDate}</p>
      </div>
    </div>
  );
};

export default StatsCard;


import Table from "../table/Table";

interface Employee {
  name: string;
  designation: string;
  type: string;
  checkInTime: string;
  status: string;
  avatar?: string; 
}


const EmployeeDashboardTable: React.FC = () => {
  const data: Employee[] = [
    {
      name: "Dina",
      designation: "Team Lead - Design",
      type: "Office",
      checkInTime: "09:27 AM",
      status: "On Time",
      avatar: "/avatars/dina1.png", 
    },
    {
      name: "Vasilisa",
      designation: "Web Designer",
      type: "Office",
      checkInTime: "10:15 AM",
      status: "Late",
      avatar: "/avatars/vasilisa1.png",
    },
    {
      name: "Dina",
      designation: "Medical Assistant",
      type: "Remote",
      checkInTime: "10:24 AM",
      status: "Late",
      avatar: "/avatars/dina2.png",
    },
    {
      name: "Vasilisa",
      designation: "Marketing Coordinator",
      type: "Office",
      checkInTime: "09:10 AM",
      status: "On Time",
      avatar: "/avatars/vasilisa2.png",
    },
    {
      name: "Jack",
      designation: "Data Analyst",
      type: "Office",
      checkInTime: "09:15 AM",
      status: "On Time",
      avatar: "/avatars/jack.png",
    },
    {
      name: "Vasilisa",
      designation: "Python Developer",
      type: "Remote",
      checkInTime: "09:29 AM",
      status: "On Time",
      avatar: "/avatars/vasilisa3.png",
    },
    {
      name: "Dina",
      designation: "React JS Developer",
      type: "Remote",
      checkInTime: "11:30 AM",
      status: "Late",
      avatar: "/avatars/dina3.png",
    },
      {
      name: "Dina",
      designation: "React JS Developer",
      type: "Remote",
      checkInTime: "11:30 AM",
      status: "Late",
      avatar: "/avatars/dina3.png",
    },
      {
      name: "Dina",
      designation: "React JS Developer",
      type: "Remote",
      checkInTime: "11:30 AM",
      status: "Late",
      avatar: "/avatars/dina3.png",
    },
      {
      name: "Dina",
      designation: "React JS Developer",
      type: "Remote",
      checkInTime: "11:30 AM",
      status: "Late",
      avatar: "/avatars/dina3.png",
    },
      {
      name: "Dina",
      designation: "React JS Developer",
      type: "Remote",
      checkInTime: "11:30 AM",
      status: "Late",
      avatar: "/avatars/dina3.png",
    },
      {
      name: "Dina",
      designation: "React JS Developer",
      type: "Remote",
      checkInTime: "11:30 AM",
      status: "Late",
      avatar: "/avatars/dina3.png",
    },
  ];

  const columns = [
    {
      key: "name",
      header: "Employee Name",
      render: (item: Employee) => (
        <div className="flex items-center space-x-3">
          <img
            src={item.avatar || "/default-avatar.png"} 
            alt={item.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span>{item.name}</span>
        </div>
      ),
    },
    {
      key: "designation",
      header: "Designation",
    },
    {
      key: "type",
      header: "Type",
    },
    {
      key: "checkInTime",
      header: "Check In Time",
    },
    {
      key: "status",
      header: "Status",
      render: (item: Employee) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            item.status === "On Time"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className=" bg-transparent ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl text-white font-semibold">Employee Overview</h1>
        <select
          className="bg-gray-900 text-white border border-gray-800 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-700"
        >
          <option>View All</option>
        </select>
      </div>
      <Table data={data} columns={columns} />
    </div>
  );
};

export default EmployeeDashboardTable;
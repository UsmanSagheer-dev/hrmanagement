import React from 'react';
import Table, { Column } from '../../components/table/Table'; 

interface ProjectRecord {
  srNo: number;
  projectName: string;
  startDate: string;
  finishDate: string;
  status: string;
}

export const ProjectsContent: React.FC = () => {
  const projectData: ProjectRecord[] = [
    { srNo: 1, projectName: "Amongus - Discovery Phase", startDate: "Feb 01, 2026", finishDate: "Mar 05, 2026", status: "Completed" },
    { srNo: 2, projectName: "Wildcare - Development Project", startDate: "Feb 12, 2026", finishDate: "April 20, 2026", status: "Completed" },
    { srNo: 3, projectName: "Hingutsan Web Development", startDate: "April 05, 2026", finishDate: "October 05, 2026", status: "In Process" },
    { srNo: 4, projectName: "Montilisy Ecommerce Platform", startDate: "May 12, 2026", finishDate: "August 12, 2026", status: "In Process" },
  ];

  const projectColumns: Column<ProjectRecord>[] = [
    { key: "srNo", header: "Sr. No." },
    { key: "projectName", header: "Project Name" },
    { key: "startDate", header: "Start Date" },
    { key: "finishDate", header: "Finish Date" },
    { 
      key: "status", 
      header: "Status", 
      render: (item) => (
        <span className={item.status === "Completed" ? "text-green-500 bg-[#3FC28A1A] p-1 rounded" : "text-yellow-500 bg-[#EFBE121A] p-1 rounded"}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="">
      <Table data={projectData} columns={projectColumns} />
    </div>
  );
};

export default ProjectsContent;
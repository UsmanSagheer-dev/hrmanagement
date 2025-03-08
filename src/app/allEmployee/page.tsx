'use client'
import React, { useState } from 'react';

import Sidebar from '../components/sidebar/Sidebar';
import Header from '../header/Header';
import Table, { Employee } from '../components/table/Table';

function AllEmployee() {
  const [employees, setEmployees] = useState<Employee[]>([
       { id: '000666000', name: 'Vasilisa', department: 'PM', designation: 'Project Manager', type: 'Office', status: 'Permanent', image: '/avatars/vasilisa.jpg' },
    { id: '000666000', name: 'Dina', department: 'HR', designation: 'HR Executive', type: 'Office', status: 'Permanent', image: '/avatars/dina.jpg' },
    { id: '000666000', name: 'Vasilisa', department: 'Developement', designation: 'React JS Developer', type: 'Office', status: 'Permanent', image: '/avatars/vasilisa.jpg' },
    { id: '000666000', name: 'Dina', department: 'Finance', designation: 'Finance Manager', type: 'Office', status: 'Permanent', image: '/avatars/dina.jpg' },
    { id: '000666000', name: 'Vasilisa', department: 'Finance', designation: 'Finance Analyst', type: 'Office', status: 'Permanent', image: '/avatars/vasilisa.jpg' },
  
    { id: '000666000', name: 'Dina', department: 'Finance', designation: 'Finance Analyst', type: 'Remote', status: 'Permanent', image: '/avatars/dina.jpg' },
    { id: '000666000', name: 'Vasilisa', department: 'Finance', designation: 'Finance Analyst', type: 'Remote', status: 'Permanent', image: '/avatars/vasilisa.jpg' },
    { id: '000666000', name: 'Dina', department: 'Finance', designation: 'Finance Analyst', type: 'Remote', status: 'Permanent', image: '/avatars/dina.jpg' },
    { id: '000666000', name: 'Vasilisa', department: 'Finance', designation: 'Finance Analyst', type: 'Remote', status: 'Permanent', image: '/avatars/vasilisa.jpg' },
    { id: '000666000', name: 'Dina', department: 'Finance', designation: 'Finance Analyst', type: 'Remote', status: 'Permanent', image: '/avatars/dina.jpg' },
    { id: '000666000', name: 'Vasilisa', department: 'Finance', designation: 'Finance Analyst', type: 'Remote', status: 'Permanent', image: '/avatars/vasilisa.jpg' },
  ]);

  const handleAddEmployee = () => {
    console.log('Add employee clicked');
  };

  const handleEdit = (employee: Employee) => {
    console.log('Edit:', employee);
  };

  const handleDelete = (employee: Employee) => {
    console.log('Delete:', employee);
  };

  const handleView = (employee: Employee) => {
    console.log('View:', employee);
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleFilter = () => {
    console.log('Filter clicked');
  };

  return (
    <div className='h-screen bg-[#131313] p-[20px]'>
      <div className='w-full h-full flex justify-between gap-3'> 
        <div>
          <Sidebar/>
        </div>
        <div className='w-full'>
          <div className='w-full'>
            <Header title="All Employees" description="All Employee Information" />
          </div>
          <div className='h-[86vh] bg-transparent border border-[#A2A1A833] rounded-[10px] p-4 overflow-auto hide-vertical-scrollbar'>
            <Table 
              employees={employees}
              onAddEmployee={handleAddEmployee}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllEmployee;
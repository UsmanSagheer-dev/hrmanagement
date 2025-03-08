'use client';
import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../header/Header';
import PersonalInformationForm from '../components/personalInformationForm/PersonalInformationForm';

function AddNewEmployee() {
  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full">
          <div className="w-full">
            <Header title="All Employees" description="All Employee > Add New Employee" />
          </div>
          <div className="h-[84vh] bg-transparent border border-[#A2A1A833] rounded-[10px]  overflow-y-scroll scrollbar-hide">
            <PersonalInformationForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewEmployee;
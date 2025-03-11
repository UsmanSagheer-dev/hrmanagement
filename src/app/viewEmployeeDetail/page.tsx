'use client';
import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Header from '../header/Header';
import PersonalInformationForm from '../personalInformationForm/PersonalInformationForm';
import ProfessionalInformationForm from '../professionalInformationForm/ProfessionalInformationForm'; 
import DocumentsForm from '../documentsForm/DocumentsForm'; 
import AccountAccessForm from '../accountAccessForm/AccountAccessForm'; 
import ProfileDetails from '../profileDetails/ProfileDetails';

function 
ViewEmployeeDetail() {


  return (
    <div className="h-screen bg-[#131313] p-[20px]">
      <div className="w-full h-full flex justify-between gap-3">
        <div>
          <Sidebar />
        </div>
        <div className="w-full flex flex-col gap-4">
          <div className="w-full ">
            <Header title="All Employees" description="All Employee > Add New Employee" />
          </div>
          <div className="">
           <ProfileDetails/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployeeDetail;
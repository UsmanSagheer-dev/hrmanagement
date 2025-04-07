"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "../../../components/button/Button";

const PasswordUpdated: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#131313]">
      <div className="bg-[#1C1C1C] p-6 rounded-lg text-center w-[436px]">
        <h2 className="text-white text-[30px] text-lg font-bold">
          Password Update Successfully
        </h2>
        <p className="text-gray-400 text-[16px] font-light mt-2 mb-[40px]">
          Your password has been updated
        </p>
        <Button
          title="Back to Login"
          onClick={() => router.push("/auth/login")}
        />
      </div>
    </div>
  );
};

export default PasswordUpdated;

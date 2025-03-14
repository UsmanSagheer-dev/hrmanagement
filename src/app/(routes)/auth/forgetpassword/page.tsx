"use client";
import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/button/Button";
import Link from "next/link";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  return (
    <div className="h-screen bg-[#131313] flex items-center justify-center">
      <div className="w-[455px] max-w-full flex flex-col justify-center">
        <div></div>
        <Link className=" w-[67px]  cursor-pointer mb-[30px]" href="/login">
          <div className="flex gap-[5px]">
            <IoChevronBackOutline color="white" size={24} />
            <h1 className=" text-white text-[16px] font-light ">Back</h1>
          </div>
        </Link>

        <div className="flex flex-col  ml-[15px] mb-[30px]">
          <h1 className="text-white text-[30px] font-semibold ">
            Forget Password
          </h1>
          <p className=" text-white text[16px] font-light ">
            Enter your registered email address. we’ll send you a code to reset
            your password.
          </p>
        </div>

        <div className="flex flex-col space-y-4 p-4 rounded-md">
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
          />
        </div>
        <div className="flex items-center justify-center  w-full px-4 mt-[30px]">
          <Button title="SEND OTP" />
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;

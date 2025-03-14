"use client";
import React, { useState } from "react";
import IMAGES from "../../../assets/images";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/button/Button";

function SignUp() {
  const widthClass = "w-[430px]";
  const heightClass = "w-56";
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="h-screen bg-[#131313] flex items-center justify-center">
      <div className="w-[455px] max-w-full flex flex-col justify-center">
        <div>
          <img
            src={IMAGES.HrLogo.src}
            alt=""
            className="w-full max-w-[409px] h-auto"
          />
        </div>
        <div className="flex flex-col  ml-[15px]">
          <h1 className="text-white text-[30px] font-semibold ">Welcome</h1>
          <p className=" text-white text[16px] font-light ">
            Please register here{" "}
          </p>
        </div>

        <div className="flex flex-col space-y-4 p-4 rounded-md">
          <InputField
            label="User Name"
            type="text"
            value={user}
            onChange={setUser}
          />
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
        </div>

        <div className="flex items-center justify-center  w-full px-4">
          <Button title="Register"  />
        </div>
      </div>
    </div>
  );
}

export default SignUp;

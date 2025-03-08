"use client";
import React, { useState } from "react";
import IMAGES from "../assets/images";
import InputField from "../components/inputField/InputField";
import Button from "../components/button/Button";
import Link from "next/link";

function Login() {
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
            Please login here{" "}
          </p>
        </div>

        <div className="flex flex-col space-y-4 p-4 rounded-md">
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
        <div className=" flex items-center justify-between w-full px-4 mt-[16px]">
          <div className=" flex items-center gap-[10px]">
            <input
              type="checkbox"
              className="w-6 h-6 bg-orange-500 border-orange-500 checked:bg-orange-500 checked:border-orange-500 accent-orange-500 cursor-pointer "
            />

            <p className=" text-white text-[16px] font-light">Remember me</p>
          </div>
          <Link href="/forgetPassword" className="text-orange-500">
          Forgot Password?
          </Link>
        </div>

        <div className="flex items-center justify-center  w-full px-4 mt-[30px]">
          <Button title="Login" />
        </div>
      </div>
    </div>
  );
}

export default Login;

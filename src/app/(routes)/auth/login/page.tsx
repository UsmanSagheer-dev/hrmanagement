"use client";
import React from "react";
import IMAGES from "../../../assets/images/index";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/button/Button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "@/app/hooks/useLogin";
import Loader from "@/app/components/loader/Loader";

function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    handleGoogleLogin,
  } = useLogin();

  return (
    <div className="h-screen bg-[#131313] flex items-center justify-center">
      <div className="w-[455px] max-w-full flex flex-col justify-center">
        <div>
          <img
            src={IMAGES.HrLogo.src}
            alt="Logo"
            className="w-full max-w-[409px] h-auto"
          />
        </div>
        <div className="flex flex-col ml-[15px]">
          <h1 className="text-white text-[30px] font-semibold">Welcome</h1>
          <p className="text-white text-[16px] font-light">Please login here</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 p-4 rounded-md"
        >
          <InputField
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            disabled={loading}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            disabled={loading}
          />

          {error && (
            <p className="text-red-500 text-[14px] text-center">{error}</p>
          )}

          <div className="flex items-center justify-between w-full px-4 mt-[16px]">
            <div className="flex items-center gap-[10px]">
              <input
                type="checkbox"
                className="w-6 h-6 bg-orange-500 border-orange-500 checked:bg-orange-500 checked:border-orange-500 accent-orange-500 cursor-pointer"
                disabled={loading}
              />
              <p className="text-white text-[16px] font-light">Remember me</p>
            </div>
            <Link href="/auth/forgetpassword" className="text-orange-500">
              Forgot Password?
            </Link>
          </div>

          <div className="flex items-center justify-center w-full px-4 mt-[30px]">
            <Button
              title={loading ? <Loader /> : "Login"}
              disabled={loading}
              type="submit"
            />
          </div>

          <div className="flex items-center justify-center w-full px-4 mt-[15px]">
            <Button
              title={loading ? "Processing..." : "Login with Google"}
              icon={FcGoogle}
              onClick={handleGoogleLogin}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-center w-full px-4 mt-[20px]">
            <p className="text-white text-[16px] font-light">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-orange-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

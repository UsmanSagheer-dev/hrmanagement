"use client";
import React from "react";
import IMAGES from "../../../assets/images";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/button/Button";
import { useSignUp } from "./useSignup";

const SignUp: React.FC = () => {
  const { formData, isLoading, handleChange, handleSubmit, navigateToLogin } =
    useSignUp();

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
        <div className="flex flex-col ml-[15px]">
          <h1 className="text-white text-[30px] font-semibold">Welcome</h1>
          <p className="text-white text-[16px] font-light">
            Please register here
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 p-4 rounded-md"
        >
          <InputField
            label="User Name"
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
          />
          <InputField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
          />
          <InputField
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
          />

          <div className="flex items-center justify-center w-full px-4 mt-4">
            <Button
              type="submit"
              title={isLoading ? "Creating Account..." : "Register"}
              disabled={isLoading}
            />
          </div>

          <div className="text-center mt-4">
            <p className="text-white text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={navigateToLogin}
                className="text-blue-400 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

"use client";
import React, { useState, useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/button/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get("email") || "";
  
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // useEffect(() => {
  //   if (!email) {
  //     router.push("/auth/login");
  //   }
  // }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validate inputs
    if (!otp || !newPassword || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("Password reset successfully");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#131313] flex items-center justify-center">
      <div className="w-[455px] max-w-full flex flex-col justify-center">
        <Link className="w-[67px] cursor-pointer mb-[30px]" href="/auth/login">
          <div className="flex gap-[5px]">
            <IoChevronBackOutline color="white" size={24} />
            <h1 className="text-white text-[16px] font-light">Back</h1>
          </div>
        </Link>

        <div className="flex flex-col ml-[15px] mb-[30px]">
          <h1 className="text-white text-[30px] font-semibold">
            Reset Password
          </h1>
          <p className="text-white text-[16px] font-light">
            Enter the OTP sent to your email and create a new password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 p-4 rounded-md"
        >
          <InputField
            label="OTP Code"
            type="text"
            value={otp}
            onChange={setOtp}
          />
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          
          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}
          
          <Button title="RESET PASSWORD" disabled={loading} />
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
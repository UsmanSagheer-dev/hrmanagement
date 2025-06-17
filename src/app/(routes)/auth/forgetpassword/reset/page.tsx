"use client";
import React, { useState, useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import InputField from "../../../../components/inputField/InputField";
import Button from "../../../../components/button/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Loader from "@/app/components/loader/Loader";

function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phoneNumber = searchParams?.get("phone") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!phoneNumber) {
      router.push("/auth/forgetpassword");
    }
  }, [phoneNumber, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

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

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forget-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
        toast.error(data.error || "Failed to reset password");
      }
    } catch (error) {
      setError("An error occurred while resetting password");
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#131313] flex items-center justify-center">
      <div className="w-[455px] max-w-full flex flex-col justify-center">
        <Link className="w-[67px] cursor-pointer mb-[30px]" href="/auth/forgetpassword">
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
            Enter the 6-digit OTP sent to your phone and set a new password (min 8 characters).
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
            disabled={loading}
       
          />
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={setNewPassword}
            disabled={loading}
          
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            disabled={loading}
          
          />

          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}

          <Button title={loading ? <Loader/> : "Reset Password"} disabled={loading} />
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
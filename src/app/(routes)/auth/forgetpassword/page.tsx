"use client";
import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!phoneNumber) {
      setError("Phone number is required");
      setLoading(false);
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("If an account exists with this phone number, you will receive an OTP.");
        toast.success("OTP sent successfully!");
        router.push(`/auth/forgetpassword/reset?phone=${encodeURIComponent(phoneNumber)}`);
      } else {
        setError(data.error || "Failed to send OTP");
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      setError("An error occurred");
      toast.error("An error occurred");
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
            Forgot Password
          </h1>
          <p className="text-white text-[16px] font-light">
            Enter your phone number and we'll send you an OTP to reset your password.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 p-4 rounded-md"
        >
          <InputField
            label="Phone Number"
            type="text"
            value={phoneNumber}
            onChange={setPhoneNumber}
            disabled={loading}
            placeholder="+1234567890"
          />

          {error && <p className="text-red-500 text-center">{error}</p>}
          {message && <p className="text-green-500 text-center">{message}</p>}

          <Button title={loading ? "Sending..." : "Send OTP"} disabled={loading} />
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;

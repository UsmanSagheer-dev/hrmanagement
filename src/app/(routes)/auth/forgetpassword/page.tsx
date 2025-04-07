"use client";
import React, { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import InputField from "../../../components/inputField/InputField";
import Button from "../../../components/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP sent to your email if it exists in our system");
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#131313] flex items-center justify-center">
      <div className="w-[455px] max-w-full flex flex-col justify-center">
        <Link className="w-[67px] cursor-pointer mb-[30px]" href="/login">
          <div className="flex gap-[5px]">
            <IoChevronBackOutline color="white" size={24} />
            <h1 className="text-white text-[16px] font-light">Back</h1>
          </div>
        </Link>

        <div className="flex flex-col ml-[15px] mb-[30px]">
          <h1 className="text-white text-[30px] font-semibold">
            Forget Password
          </h1>
          <p className="text-white text-[16px] font-light">
            Enter your registered email address. We'll send you a code to reset
            your password.
          </p>
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
          />
          {message && <p className="text-white text-center">{message}</p>}
          <Button title="SEND OTP" disabled={loading} />
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;

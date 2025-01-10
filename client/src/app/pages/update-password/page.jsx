"use client";

import React, { useEffect, useState } from "react";
import { resetPasswordService } from "@/app/services/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";
import InputCommon from "@/app/components/commonComponents/InputCommon";
import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch OTP from query parameters if present
  useEffect(() => {
    const otpFromQuery = searchParams.get("otp");
    if (otpFromQuery) {
      setFormData((prev) => ({ ...prev, otp: otpFromQuery }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleResetPassword = () => {
    const { otp, newPassword, confirmPassword } = formData;

    let errors = {};
    if (!otp) errors.otp = "OTP is required";
    if (!newPassword) errors.newPassword = "New Password is required";
    if (newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setError(errors);

    if (Object.keys(errors).length === 0) {
      handleResetPasswordApiRequest(formData);
    }
  };

  const handleResetPasswordApiRequest = async (payload) => {
    try {
      const res = await resetPasswordService(payload);
      toast.success("Password reset successfully!");
      setTimeout(() => {
        router.push("/pages/login");
      }, 1500);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Password reset failed. Try again!"
      );
    }
  };

  return (
    <>
      <div className="flex w-full h-screen text-primary-950 ">
        {/* Left Section */}
        <div className="bg-primary-200 flex flex-col justify-center items-center w-[35%] h-full p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Notes Revise App</h1>
          <p className="text-lg ">
            Organize your notes. <br />
            Revise with ease. <br />
            Excel in every exam!
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-white w-[65%] h-full flex flex-col justify-center items-center p-8">
          <div className="rounded-md p-4 lg:w-[50%]">
            <h2 className="text-2xl font-bold text-primary-950 mb-6 text-center">
              Reset Password
            </h2>

            {/* Input Fields */}
            <div className="space-y-4">
              <InputCommon
                label="OTP"
                name="otp"
                type="text"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter your OTP"
                error={error.otp}
              />

              <InputCommon
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                error={error.newPassword}
              />

              <InputCommon
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                error={error.confirmPassword}
              />
            </div>

            {/* Reset Button */}
            <div className="mt-6">
              <ButtonCommon
                label="Reset Password"
                onClick={handleResetPassword}
                className="w-full bg-primary-950 hover:bg-primary-800"
              />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

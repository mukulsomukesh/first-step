"use client";

import React, { useState } from "react";
import ButtonCommon from "../commonComponents/ButtonCommon";
import InputCommon from "../commonComponents/InputCommon";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPasswordService } from "@/app/services/auth";

export default function ForgotPasswordModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setEmail(""); // Clear email when closing
    setError(""); // Clear error when closing
  };

  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error as user types
  };

  // Validate email
  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateEmail()) {
      return 0;
    }

    try {
      const res = await forgotPasswordService({ email: email });
      toast.success(
        "A password reset link has been sent to your email. Please check your inbox."
      );

      // setTimeout(() => {
      //   setIsModalOpen(true);
      // }, 2500);
    } catch (error) {
      console.log("Error: ", error);
      toast.error(
        error?.response?.data?.message ||
          "Unable to send the password reset email. Please try again later."
      );
    }
  };

  return (
    <div>
      {/* Button to open modal */}

      <p onClick={toggleModal} className="font-bold">
        Forgot Password
      </p>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-center mb-4">
              Forgot Password
            </h2>

            {/* Email Input */}
            <div>
              <InputCommon
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                label={"Email"}
                name={"email"}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-4">
              <ButtonCommon
                variant="outline"
                label="Close"
                onClick={toggleModal}
              />
              <ButtonCommon label="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

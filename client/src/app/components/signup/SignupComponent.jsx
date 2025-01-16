"use client";

import React, { useState } from "react";
import InputCommon from "../commonComponents/InputCommon";
import ButtonCommon from "../commonComponents/ButtonCommon";
import { signupService } from "@/app/services/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function SignupComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const routes = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = () => {
    const { name, email, password, confirmPassword } = formData;

    let errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Invalid email address";
    if (!password) errors.password = "Password is required";
    if (password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    setError(errors);

    if (Object.keys(errors).length === 0) {
      handelSignupApiRequest(formData);
    }
  };

  // handel api call
  const handelSignupApiRequest = async (payload) => {
    setIsLoading(true);
    try {
      const res = await signupService(payload);
      toast.success("Signup success!");
      setTimeout(() => {
        routes.push("/pages/login");
      }, 1500);
    } catch (error) {
      toast.error(error?.message?.response?.data?.data || "Signup Failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex w-full h-screen text-primary-600 ">
        <div className="bg-white  mx-auto w-[100%] h-full flex flex-col justify-center items-center p-8">
          <div className=" rounded-md p-4 w-[100%] max-w-[500px] ">
            <h2 className="text-2xl font-bold text-primary-950 mb-6 text-center">
              Sign Up
            </h2>

            {/* Input Fields */}
            <div className="space-y-4 ">
              <InputCommon
                label="Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                error={error.name}
              />

              <InputCommon
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={error.email}
              />
              <InputCommon
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                error={error.password}
              />
              <InputCommon
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                error={error.confirmPassword}
              />
            </div>

            {/* Signup Button */}
            <div className="mt-6 ">
              <ButtonCommon
                label="Sign Up"
                onClick={handleSignup}
                className="w-full"
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>

            {/* Already Registered */}
            <p className="mt-4 text-primary-950">
              Already have an account?{" "}
              <a href="login" className="text-primary-950 font-semibold">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

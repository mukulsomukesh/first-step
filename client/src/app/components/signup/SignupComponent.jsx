"use client";

import React, { useState } from "react";
import InputCommon from "../commonComponents/InputCommon";
import ButtonCommon from "../commonComponents/ButtonCommon";

export default function SignupComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState({});

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
      alert("Signup Successful!");
      // Add your signup logic here
    }
  };

  return (
    <>
      <div className="flex w-full h-screen text-primary-950 ">
        {/* Left Section */}
        <div className="bg-primary-200 flex flex-col justify-center items-center w-[35%] h-full p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Notes Revise App
          </h1>
          <p className="text-lg ">
            Organize your notes. <br />
            Revise with ease. <br />
            Excel in every exam!
          </p>
        </div>

        {/* Right Section */}
        <div className="bg-white w-[65%] h-full flex flex-col justify-center items-center p-8">
          <div className=" rounded-md p-4 lg:w-[50%]">
            <h2 className="text-2xl font-bold text-primary-950 mb-6 text-center">
              Sign Up
            </h2>

            {/* Input Fields */}
            <div className="space-y-4">
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
                className="w-full bg-primary-950 hover:bg-primary-800"
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
    </>
  );
}

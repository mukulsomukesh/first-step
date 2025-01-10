"use client";

import React, { useState } from "react";
import InputCommon from "../commonComponents/InputCommon";
import ButtonCommon from "../commonComponents/ButtonCommon";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { loginService } from "@/app/services/auth";
import ForgotPasswordModal from "../modals/ForgotPasswordModal";

export default function LoginComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const routes = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = () => {
    const { name, email, password, confirmPassword } = formData;

    let errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      errors.email = "Invalid email address";
    if (!password) errors.password = "Password is required";

    setError(errors);

    if (Object.keys(errors).length === 0) {
      handelLoginApiRequest(formData);
    }
  };

  // handel api call
  const handelLoginApiRequest = async (payload) => {
    try {
      const res = await loginService(payload);
      toast.success("Login success!");
      setTimeout(() => {
        routes.push("/pages/notes");
      }, 1500);
    } catch (error) {
      console.log(" error ", error);
      alert(" stipr");
      toast.error(error?.message?.response?.data?.data || "Login Failed!");
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
          <div className=" rounded-md p-4 lg:w-[50%]">
            <h2 className="text-2xl font-bold text-primary-950 mb-6 text-center">
              Login
            </h2>

            {/* Input Fields */}
            <div className="space-y-4">
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
            </div>

            {/* Login Button */}
            <div className="mt-6 ">
              <ButtonCommon
                label="Login"
                onClick={handleSignup}
                className="w-full bg-primary-950 hover:bg-primary-800"
              />
            </div>

            {/* Already Registered */}
            <div className="flex justify-between mt-4">
              <p className=" text-primary-950">
                Don't have account
                <a
                  href="signup"
                  className="text-primary-950 ml-2 font-semibold"
                >
                  Signup
                </a>
              </p>
              <ForgotPasswordModal />
              {/* <p className="font-bold">Forgot Password</p> */}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

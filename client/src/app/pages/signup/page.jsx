import SignupComponent from "@/app/components/signup/SignupComponent";
import React from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function page() {
  return (
    <div>
      <SignupComponent />

      <ToastContainer />
    </div>
  );
}

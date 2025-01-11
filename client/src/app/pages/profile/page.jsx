"use client";

import {
  getUserProfileService,
  updateUserProfileService,
} from "@/app/services/auth";
import React, { useState, useEffect } from "react";
import { FaUserEdit, FaEnvelope, FaUser, FaCamera } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VscSaveAs } from "react-icons/vsc";

import axios from "axios";
import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";

const page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email: "",
    profilePicture: null,
  });

  useEffect(() => {
    // Get user profile on page load
    handleGetProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // Create the FormData object to handle both fields and file uploads
      const formData = new FormData();
      formData.append("name", updatedUser.name);
      formData.append("email", updatedUser.email);

      // If the profilePicture exists (i.e., it's not null or a placeholder), append it to FormData
      if (updatedUser.profilePicture) {
        // Upload the image to Cloudinary first
        const imageUrl = await uploadImageToCloudinary(
          updatedUser.profilePicture
        );

        // Once the image is uploaded, append the URL to the form data
        formData.append("profilePicture", imageUrl);
      }

      // Call API to save changes
      const data = await updateUserProfileService(formData);

      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        toast.error(data.message || "Error updating profile!");
      }
    } catch (error) {
      toast.error("Error updating profile!");
    }
  };

  // Helper function to upload image to Cloudinary
  const uploadImageToCloudinary = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "filesharing-app"); // Your upload preset name

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dfrhy6m3m/auto/upload",
        formData
      );
      return response.data.secure_url; // This is the image URL from Cloudinary
    } catch (error) {
      throw new Error("Error uploading image to Cloudinary");
    }
  };

  const handleGetProfile = async () => {
    try {
      const data = await getUserProfileService();
      setUpdatedUser({
        name: data.data.name,
        email: data.data.email,
        profilePicture: data.data.profilePicture,
      });
    } catch (error) {
      toast.error("Failed to fetch user profile!");
    }
  };

  return (
    <div className=" min-h-screen flex justify-center items-center">
      <div className=" shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* Profile Picture */}
        <div className="relative flex justify-center mb-6">
          <div className="relative">
            <img
              src={
                updatedUser.profilePicture || "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full cursor-pointer">
                <FaCamera />
                <input
                  type="file"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const imageUrl = await uploadImageToCloudinary(file);
                        setUpdatedUser((prev) => ({
                          ...prev,
                          profilePicture: imageUrl,
                        }));
                      } catch (error) {
                        toast.error("Error uploading image to Cloudinary");
                      }
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* User Details */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-500 mb-2">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-2 py-1 w-full text-center"
              />
            ) : (
              updatedUser.name
            )}
          </h1>
          <p className="text-gray-500">
            <FaEnvelope className="inline mr-2" />
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg px-2 py-1 w-full text-center"
              />
            ) : (
              updatedUser.email
            )}
          </p>
        </div>

        {/* Role */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            <FaUser className="inline mr-2" />
            Role: {updatedUser.role || "user"}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          {isEditing ? (
            <ButtonCommon
              onClick={handleSave}
              label="Save Changes"
              icon={<VscSaveAs />}
            />
          ) : (
            <ButtonCommon
              onClick={handleEditClick}
              label="Edit Profile"
              icon={<FaUserEdit />}
            />
          )}
          {isEditing && (
            <ButtonCommon
              onClick={() => setIsEditing(false)}
              variant="danger"
              label="Cancel"
            />
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default page;

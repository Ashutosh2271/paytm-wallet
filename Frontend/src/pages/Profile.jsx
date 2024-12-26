import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null); 
  const { users } = useContext(AuthContext);  


  useEffect(() => {
    const fetchProfile = async () => {
      if (!users?.upi_id) return; 
      try {
        const response = await axios.get(
          `http://localhost:3000/user/${users.upi_id}`
        );

        if (response.data) {
          setProfile(response.data?.user);
        }
      } catch (error) {
        console.log("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [Profile.balance]); 

  if (!users) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-bold text-gray-700">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-bold text-gray-700">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md mb-5">
      <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>
      <div>
        <h1 className="text-lg font-semibold">{profile.name}</h1>
        <h3 className="text-gray-600">Balance: {profile.balance}</h3>
        <h3 className="text-gray-600">UPI ID: {profile.upi_id}</h3>
        <h3 className="text-gray-600">Email: {profile.email}</h3>
      </div>
    </div>
  );
};

export default Profile;

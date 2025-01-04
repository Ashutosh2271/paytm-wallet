import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/Context";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null); // Profile data
  const [amount, setAmount] = useState(""); // Amount to add
  const { users } = useContext(AuthContext); // Auth context

  // Fetch user profile
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
  }, []);

  
  const handleAddMoney = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/wallet", {
        upi_id: users.upi_id,
        amount,
      });

      if (response.status === 200) {
        alert(response.data.message || "Money added successfully");
        setProfile((prev) => ({
          ...prev,
          balance: prev.balance + parseInt(amount),
        }));
        setAmount(""); 
      } else {
        alert(response.data.message || "Failed to add money");
      }
    } catch (error) {
      console.error("Error adding money:", error);
      alert("An error occurred while adding money");
    }
  };

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
      <div className="mb-6">
        <h1 className="text-lg font-semibold">Name: {profile.name}</h1>
        <h3 className="text-gray-600">Balance: ₹{profile.balance}</h3>
        <h3 className="text-gray-600">UPI ID: {profile.upi_id}</h3>
        <h3 className="text-gray-600">Email: {profile.email}</h3>
      </div>

      {/* Add Money Section */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Add Money</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />
        <button
          onClick={handleAddMoney}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Add Money
        </button>
      </div>
    </div>
  );
};

export default Profile;

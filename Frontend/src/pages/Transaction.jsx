import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/Context';
import TransactionHistory from './TransactionHistory';
import { toast } from 'react-toastify';
import Profile from './Profile';

const Transaction = () => {
  const [receiver_upi_id, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [loadingOtp, setLoadingOtp] = useState(false);
  const[loading,setLoading] = useState(false)
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const { users } = useContext(AuthContext);

  const sender_upi_id = users?.upi_id; // Defined from AuthContext

  const handleTransaction = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post('http://localhost:3000/transaction', {
        sender_upi_id,
        receiver_upi_id,
        amount,
        otp,
      });
      toast.success('Transaction successful');
      setLoading(false);
      setAmount('');
      setUpiId('');
      setOtp('');
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!receiver_upi_id) {
      setError('Receiver UPI ID is required to send OTP.');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('A valid amount is required to send OTP.');
      return;
    }
    try {
      setLoadingOtp(true);
      setError('');
      const response = await axios.post('http://localhost:3000/otp', {
        upi_id: sender_upi_id,
        amount
      });
      toast.success(response.data.message || 'OTP sent successfully');
      setLoadingOtp(false);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoadingOtp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Profile />
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Send Money</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={receiver_upi_id}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleTransaction}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={loading || !receiver_upi_id || !amount || !otp}
          >
            {loading ? 'Processing...' : 'Send Money'}
          </button>
          <button
            onClick={sendOtp}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={loadingOtp}
          >
            {loadingOtp ? 'Processing...' : 'Send OTP'}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
      <TransactionHistory user={users} />
    </div>
  );
};

export default Transaction;

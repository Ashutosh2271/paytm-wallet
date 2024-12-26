import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/Context';
import TransactionHistory from './TransactionHistory';
import { toast } from 'react-toastify';
import Profile from './Profile';

const Transaction = () => {
  const [receiver_upi_id, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {users,} = useContext(AuthContext)
  
  const sender_upi_id = users?.upi_id

  const handleTransaction = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/transaction', {
        sender_upi_id,
        receiver_upi_id,
        amount,
      });
     toast.success('Transaction successful');
      setLoading(false);
      setAmount("")
      setUpiId("")
      setError("")
    } catch (err) {
      console.error(err.response.data.message); // For debugging

      setError(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Profile/>
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

        <button
          onClick={handleTransaction}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Send Money'}
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <TransactionHistory user={users}/>
    </div>
  );
};

export default Transaction;

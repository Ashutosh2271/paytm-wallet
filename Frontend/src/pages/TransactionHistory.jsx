import React, { useState, useEffect,} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransactionHistory = ({ user }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const upi_id = user?.upi_id;
        
        if (!upi_id) {
          throw new Error("UPI ID is not available");
        }
        const response = await axios.get(`http://localhost:3000/transaction/${upi_id}`);
        if(!response){
          setError("not found ")
        }
        setTransactions(response.data.transactions || []);
        setError('')
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };


    fetchTransactions();
  },[]);


  

  const filteredTransactions = transactions.filter(
    (txn) =>
      (txn.sender?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (txn.receiver?.toLowerCase() || '').includes(search.toLowerCase())
  );

  if (!user) {
    
    navigate("/login")
    return null; // Avoid rendering the component if user is not logged in
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
  
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by sender or receiver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading transactions...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : transactions.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 border">Date</th>
                <th className="p-4 border">Sender</th>
                <th className="p-4 border">Receiver</th>
                <th className="p-4 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-gray-50">
                  <td className="p-4 border">{new Date(txn.timestamp).toLocaleDateString()}</td>
                  <td className="p-4 border">{txn.sender_upi_id || 'N/A'}</td>
                  <td className="p-4 border">{txn.receiver_upi_id || 'N/A'}</td>
                  <td className="p-4 border text-blue-600 font-bold">₹{txn.amount}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-600">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;

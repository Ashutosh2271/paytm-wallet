const transactionModel = require('../model/Transaction');
const userModel = require('../model/user.model');

module.exports.makeTransaction = async (req, res) => {
  try {
    const { sender_upi_id, receiver_upi_id, amount } = req.body;

    // Validate input
    if (!sender_upi_id || !receiver_upi_id || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (sender_upi_id === receiver_upi_id) {
      return res.status(400).json({ message: 'Sender and receiver cannot be the same' });
    }   

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    // Fetch sender and receiver
    const sender = await userModel.findOne({ upi_id: sender_upi_id });
    const receiver = await userModel.findOne({ upi_id: receiver_upi_id });

    if (!sender) return res.status(404).json({ message: 'Sender not found' });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    // Check sender's balance
    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Perform the transaction
    sender.balance -= amount;
    receiver.balance += amount;

    // Save updated balances
    await sender.save();
    await receiver.save();

    // Create a transaction record
    const transaction = await transactionModel.create({
      sender_upi_id,
      receiver_upi_id,
      amount,
      timestamp: new Date(),    
    });

    // Return success response
    res.status(200).json({
      message: 'Transaction successful',
      transaction,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};



module.exports.getTransactionsByUpi = async (req, res) => {
  try {
    const { upi_id } = req.params; // Extract UPI ID from route parameters

    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }

    // Find all transactions where the user is either the sender or the receiver
    const transactions = await transactionModel.find({
      $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }],
    }).sort({ timestamp: -1 }); // Sort transactions by timestamp (most recent first)

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this UPI ID' });
    }

    res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

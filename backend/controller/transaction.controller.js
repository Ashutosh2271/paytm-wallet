const transactionModel = require('../model/Transaction');
const userModel = require('../model/user.model');

module.exports.makeTransaction = async (req, res) => {
  try {
    const { sender_upi_id, receiver_upi_id, amount } = req.body;


    if (!sender_upi_id || !receiver_upi_id || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (sender_upi_id === receiver_upi_id) {
      return res.status(400).json({ message: 'Sender and receiver cannot be the same' });
    }   

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    const sender = await userModel.findOne({ upi_id: sender_upi_id });
    const receiver = await userModel.findOne({ upi_id: receiver_upi_id });

    if (!sender) return res.status(404).json({ message: 'Sender not found' });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

  
    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const senderBalance = Number(sender.balance);
    const receiverBalance = Number(receiver.balance);
    const transactionAmount = Number(amount);

    sender.balance = senderBalance - transactionAmount;
    receiver.balance = receiverBalance + transactionAmount;
    
    await sender.save();
    await receiver.save();

   
    const transaction = await transactionModel.create({
      sender_upi_id,
      receiver_upi_id,
      amount,
      timestamp: new Date(),    
    });


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
    const { upi_id } = req.params; 

    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }

  
    const transactions = await transactionModel.find({
      $or: [{ sender_upi_id: upi_id }, { receiver_upi_id: upi_id }],
    }).sort({ timestamp: -1 });

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

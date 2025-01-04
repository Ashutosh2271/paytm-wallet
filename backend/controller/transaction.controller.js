const transactionModel = require('../model/Transaction');
const userModel = require('../model/user.model');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const otpCache = new Map();

module.exports.requestOtp = async (req, res) => {
  try {
    const { upi_id, } = req.body;


    if (!upi_id) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }

    const user = await userModel.findOne({ upi_id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

 
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpCache.set(upi_id, otp);

    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Transaction OTP',
      text: `Your OTP for the transaction is ${otp}. It is valid for 5 minutes.`,
    });

   
    setTimeout(() => otpCache.delete(upi_id), process.env.OTP_EXPIRATION_TIME || 300000);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

module.exports.makeTransaction = async (req, res) => {
  try {
    const { sender_upi_id, receiver_upi_id, amount, otp } = req.body;

    if (!sender_upi_id || !receiver_upi_id || !amount || !otp) {
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

 
    const cachedOtp = otpCache.get(sender_upi_id);
    if (!cachedOtp || cachedOtp !== parseInt(otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

  
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();


    const transaction = await transactionModel.create({
      sender_upi_id,
      receiver_upi_id,
      amount,
      timestamp: new Date(),
    });

  
    otpCache.delete(sender_upi_id);

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

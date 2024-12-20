const userModel = require('../model/user.model');
const transactionModel = require('../model/Transaction')
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const crypto = require('crypto')

module.exports.registerUser = async (req, res) => {
  const generateUpi=()=>{
   const randomId = crypto.randomBytes(4).toString('hex');
   return `${randomId}`
  }
  try {
    // Validate incoming data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const upiId = generateUpi();
    console.log(upiId)

    // Check if the email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await userModel.hashPassword(password);

    // Create user with upi_id and balance
    const user = await userService.createUser({
      name,
      email,
      password: hashedPassword,
      upi_id: upiId,
      balance: 0, // Default balance
      aletr:"ashu"
    });

    // Generate auth token
    const token = user.generateAuthToken();

    // Return success response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        upi_id: user.upi_id,
        balance: user.balance,
        alter:"ashu",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


module.exports.loginUser = async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
     return res.status(400).json({errors:errors.array()});
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
      return res.status(401).json({message:"invalid email or password "});
    }
     
      const isMatch = await user.comparePassword(password)

      if(!isMatch){
        return res.status(401).json({message:"invalid email or password "});
      }

      const token = user.generateAuthToken();
      
     res.status(200).json({token,user});


}



module.exports.fetchUserDetailsByUpi = async (req, res) => {
  try {
    const { upi_id } = req.params; // Extract upi_id from request parameters

    if (!upi_id) {
      return res.status(400).json({ message: "UPI ID is required" });
    }

    // Fetch user details by UPI ID, excluding password
    const user = await userModel.findOne({ upi_id }).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found with this UPI ID" });
    }

    // Send user details as a response
    res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};



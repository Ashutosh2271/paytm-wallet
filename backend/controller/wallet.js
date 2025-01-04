const userModel = require('../model/user.model');

module.exports.addMoney = async function (req, res) {
     const { upi_id, amount } = req.body;
   const MAX_AMOUNT = 10000
    try {
    

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }
            
         
           if (amount > MAX_AMOUNT) {
            return res.status(400).json({ message: `Maximum amount reached is ₹${MAX_AMOUNT}` });
        }
    
        const user = await userModel.findOne({ upi_id: upi_id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       
        user.balance += amount;

        
        await user.save();

        res.status(200).json({ message: "Money added successfully", balance: user.balance });
    } catch (error) {
        console.error("Error adding money:", error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

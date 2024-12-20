const userModel = require('../model/user.model');

module.exports.createUser = async ({
  name,
  email,
  password,
  upi_id,
  balance,
}) => {
  // Validate required fields
  if (!name || !email || !password || !upi_id || balance === undefined) {
    throw new Error("All fields are required");
  }

  // Create the user
  const user = await userModel.create({
    name,
    email,
    password,
    upi_id,
    balance,
  });

  return user;
};

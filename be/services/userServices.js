const userModel = require('../models/userModel');

exports.getAllUsers = async () => {
  const users = await userModel.findAll();
  return users;
};

const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Create a User model using the userSchema
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the User model

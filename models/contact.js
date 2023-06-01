const mongoose = require("mongoose");

// Create Schema
const Contact = mongoose.model("Contact", {
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
});

module.exports = Contact;

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
  createdAt: {
    type: Date,
    default: new Date().toISOString(),
  },
  updateAt: {
    type: Date,
    default: new Date().toISOString(),
  },
});

module.exports = Contact;

const Contact = require("../models/contact");
require("../utils/database");
const { body, validationResult, check } = require("express-validator");

// // Get Data Contact Pages
const getContacts = async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact",
    contacts,
    msg: req.flash("msg"),
  });
};

// Add Contact Form Pages
const getAddContactForm = async (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Add Contact",
  });
};

// Post Data Contact Add Process
const addContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("add-contact", {
        title: "Add Contact Form",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    }

    check("email", "Email is Invalid!").isEmail();
    check("phone_number", "Phone number is invalid").isMobilePhone("id-ID");

    await Contact.insertMany(req.body);
    req.flash("msg", "Contact has successfully added!");
    res.redirect("/contact");
  } catch (error) {
    console.log(error);
  }
};

// Delete Data contact
const deleteContact = async (req, res) => {
  await Contact.deleteOne({ name: req.body.name })
    .then(() => {
      req.flash("msg", "Data contact has succesfully deleted!");
      res.redirect("/contact");
    })
    .catch((error) => {
      console.log(error);
    });
};

// Edit Contact Form Contact Pages
const editContact = async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Edit Contact",
    contact,
  });
};

// Update Contact Process
const updateContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("edit-contact", {
        title: "Edit Contact Form",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    }

    check("email", "Email is Invalid!").isEmail();
    check("phone_number", "Phone number is invalid").isMobilePhone("id-ID");

    Contact.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          phone_number: req.body.phone_number,
          email: req.body.email,
        },
      }
    );
    req.flash("msg", "Contact has succesfully updated!");
    res.redirect("/contact");
  } catch (error) {
    console.log(error);
  }
};

// Get Contact Detail Pages
const detailContact = async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Detail Contact",
    contact,
    active: "/contact",
  });
};

module.exports = {
  getContacts,
  getAddContactForm,
  addContact,
  deleteContact,
  editContact,
  updateContact,
  detailContact,
};

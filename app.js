const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

require("./utils/database");
const Contact = require("./models/contact");
const {
  getContacts,
  getAddContactForm,
  addContact,
  deleteContact,
  editContact,
  updateContact,
  detailContact,
} = require("./controllers/contactController");

const app = express();
const port = 3000;

// Setup method override
app.use(methodOverride("_method"));

// EJS setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Flash configuration
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Middleware for markdown nav-item active in navbar
app.use((req, res, next) => {
  // Get current path from URL
  const currentPath = req.path;

  // Add active property to object res.locals
  res.locals.active = currentPath;

  // Continue to the next middleware or next route
  next();
});

// Home Pages
app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    name: "Kadek Angga",
    title: "Home",
  });
});

// About Pages
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "About",
  });
});

// Contact CRUD
app.get("/contact", getContacts);
app.get("/contact/add", getAddContactForm);
app.post(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Contact name has been used!");
      }
      return true;
    }),
    body("phone_number").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ phone_number: value });
      if (value !== req.body.oldPhoneNumber && duplicate) {
        throw new Error("Contact number has been used!");
      }
      return true;
    }),
    check("email", "Email is Invalid!").isEmail(),
    check("phone_number", "Number is Invalid!").isMobilePhone("id-ID"),
  ],
  addContact
);
app.delete("/contact", deleteContact);
app.get("/contact/edit/:name", editContact);
app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Contact name has been used!");
      }
      return true;
    }),
    body("phone_number").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ phone_number: value });
      if (value !== req.body.oldPhoneNumber && duplicate) {
        throw new Error("Contact number has been used!");
      }
      return true;
    }),
    check("email", "Email is Invalid!").isEmail(),
    check("phone_number", "Number is Invalid!").isMobilePhone("id-ID"),
  ],
  updateContact
);
app.get("/contact/:name", detailContact);

// // Get Data Contact Pages
// app.get("/contact", async (req, res) => {
//   const contacts = await Contact.find();

//   res.render("contact", {
//     layout: "layouts/main-layout",
//     title: "Contact",
//     contacts,
//     msg: req.flash("msg"),
//   });
// });

// // Add Contact Form Pages
// app.get("/contact/add", async (req, res) => {
//   res.render("add-contact", {
//     layout: "layouts/main-layout",
//     title: "Add Contact",
//   });
// });

// // Data Contact Add Process
// app.post(
//   "/contact",
//   [
//     body("name").custom(async (value) => {
//       const duplicate = await Contact.findOne({ name: value });
//       if (duplicate) {
//         throw new Error("Name has already been used!");
//       }
//       return true;
//     }),
//     body("phone_number").custom(async (value) => {
//       const duplicate = await Contact.findOne({ phone_number: value });
//       if (duplicate) {
//         throw new Error("Number has already been used!");
//       }
//       return true;
//     }),
//     check("email", "Email is Invalid!").isEmail(),
//     check("phone_number", "Phone number is invalid").isMobilePhone("id-ID"),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.render("add-contact", {
//         title: "Add Contact Form",
//         layout: "layouts/main-layout",
//         errors: errors.array(),
//       });
//     } else {
//       Contact.insertMany(req.body)
//         .then(() => {
//           // Send flash massage if success
//           req.flash("msg", "Contact has succesfully added!");
//           res.redirect("/contact");
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   }
// );

// app.delete("/contact", async (req, res) => {
//   Contact.deleteOne({ name: req.body.name })
//     .then(() => {
//       req.flash("msg", "Data contact has succesfully deleted!");
//       res.redirect("/contact");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

// // Edit Contact Form Contact Pages
// app.get("/contact/edit/:name", async (req, res) => {
//   const contact = await Contact.findOne({ name: req.params.name });

//   res.render("edit-contact", {
//     layout: "layouts/main-layout",
//     title: "Edit Contact",
//     contact,
//   });
// });

// // Update Contact Process
// app.put(
//   "/contact",
//   [
//     body("name").custom(async (value, { req }) => {
//       const duplicate = await Contact.findOne({ name: value });
//       if (value !== req.body.oldName && duplicate) {
//         throw new Error("Contact name has been used!");
//       }
//       return true;
//     }),
//     body("phone_number").custom(async (value, { req }) => {
//       const duplicate = await Contact.findOne({ phone_number: value });
//       if (value !== req.body.oldPhoneNumber && duplicate) {
//         throw new Error("Contact number has been used!");
//       }
//       return true;
//     }),
//     check("email", "Email is Invalid!").isEmail(),
//     check("phone_number", "Number is Invalid!").isMobilePhone("id-ID"),
//   ],
//   (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       res.render("edit-contact", {
//         title: "Form Edit Contact",
//         layout: "layouts/main-layout",
//         errors: errors.array(),
//         contact: req.body,
//       });
//     } else {
//       Contact.updateOne(
//         { _id: req.body._id },
//         {
//           $set: {
//             name: req.body.name,
//             phone_number: req.body.phone_number,
//             email: req.body.email,
//           },
//         }
//       )
//         .then(() => {
//           req.flash("msg", "Contact has succesfully updated!");
//           res.redirect("/contact");
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   }
// );

// // Contact Detail Pages
// app.get("/contact/:name", async (req, res) => {
//   const contact = await Contact.findOne({ name: req.params.name });

//   res.render("detail", {
//     layout: "layouts/main-layout",
//     title: "Contact Detail",
//     contact,
//     active: "/contact",
//   });
// });

app.listen(port, () => {
  console.log(`Contact App Lite | Listening on port http://localhost:${port}`);
});

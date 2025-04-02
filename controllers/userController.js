require("dotenv").config();
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("./passport");

const { ADMIN_PASSWORD, CLUB_PASSWORD } = process.env;

const validateUserSignUp = [
  body("fname")
    .trim()
    .isAlpha()
    .withMessage("First name must only contain letters.")
    .isLength({ min: 1, max: 20 })
    .withMessage("First name must be between 1 and 20 characters."),
  body("lname")
    .trim()
    .isAlpha()
    .withMessage("Last name must only contain letters.")
    .isLength({ min: 1, max: 20 })
    .withMessage("Last name must be between 1 and 20 characters."),
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage("Username can only contain letters and digits")
    .isLength({ min: 1, max: 20 })
    .withMessage("Username must be between 1 and 20 characters.")
    .custom(async (value) => {
      const exists = await db.getUserByUsername(value);
      if (exists) throw new Error("Username already exists.");
      return true;
    }),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 5,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })
    .withMessage("Password must be atleast 5 characters."),
  body("confirm")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm password doesn't match."),
];

exports.addUserToLocals = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

exports.renderHome = (req, res) => res.render("index", { title: "Homepage" });

exports.createUserGet = (req, res) => res.render("sign-up");

exports.createUserPost = [
  validateUserSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .render("sign-up", { errors: errors.array(), data: req.body });
    }

    const { fname, lname, username, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    await db.insertUser(fname, lname, username, hashedPass);
    res.redirect("/log-in");
  },
];

exports.userLogInGet = (req, res) => {
  let errors = null;
  if (req.session.messages) {
    errors = req.session.messages.map((msg) => ({ msg }));
    delete req.session.messages;
  }
  res.render("log-in", { errors });
};

exports.userLogInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: true,
});

exports.userLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.memberFormGet = (req, res) => {
  if (!req.user) res.redirect("/");
  res.render("member-form");
};

exports.memberFormPost = async (req, res) => {
  if (!req.user) res.redirect("/");
  if (req.body.password === CLUB_PASSWORD) {
    await db.toggleUserMembership(req.user.id);
    res.redirect("/");
  } else {
    res.render("member-form", { errors: [{ msg: "Incorrect password!" }] });
  }
};

exports.adminFormGet = (req, res) => {
  if (!req.user) res.redirect("/");
  res.render("admin-form");
};

exports.adminFormPost = async (req, res) => {
  if (!req.user) res.redirect("/");
  if (req.body.password === ADMIN_PASSWORD) {
    await db.toggleUserAdmin(req.user.id);
    res.redirect("/");
  } else {
    res.render("admin-form", { errors: [{ msg: "Incorrect password!" }] });
  }
};

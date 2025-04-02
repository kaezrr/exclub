const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

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

exports.userLogInGet = (req, res) => res.render("log-in");

exports.userLogInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

exports.userLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

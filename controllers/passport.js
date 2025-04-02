const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await db.getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: "Username doesn't exist!" });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: "Password doesn't match!" });
    }
    return done(null, user);
  }),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await db.getUserByID(id);
  done(null, user);
});

module.exports = passport;

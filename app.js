require("dotenv").config();

const express = require("express");
const session = require("express-session");
const db = require("./db/pool");
const Store = require("connect-pg-simple")(session);
const passport = require("./controllers/passport");

const userRouter = require("./routes/userRouter");
const App = express();

App.set("view engine", "ejs");
App.use(express.static("public"));
App.use(express.urlencoded({ extended: false }));
App.use(
  session({
    store: new Store({
      pool: db,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  }),
);
App.use(passport.session());
App.use("/", userRouter);

const PORT = process.env.PORT || 3000;
App.listen(PORT, () => console.log(`App listening on port ${PORT}...`));

const { Router } = require("express");
const userController = require("../controllers/userController");

const userRouter = new Router();

userRouter.use(userController.addUserToLocals);

userRouter.get("/", userController.renderHome);

userRouter.get("/sign-up", userController.createUserGet);
userRouter.post("/sign-up", userController.createUserPost);

userRouter.get("/log-in", userController.userLogInGet);
userRouter.post("/log-in", userController.userLogInPost);

userRouter.get("/log-out", userController.userLogOut);

module.exports = userRouter;

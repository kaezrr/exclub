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

userRouter.get("/club-membership", userController.memberFormGet);
userRouter.post("/club-membership", userController.memberFormPost);

userRouter.get("/admin-membership", userController.adminFormGet);
userRouter.post("/admin-membership", userController.adminFormPost);

userRouter.get("/create-post", userController.createMessageGet);
userRouter.post("/create-post", userController.createMessagePost);

userRouter.get("/delete", userController.deleteMessage);
userRouter.get("/posts", userController.viewPosts);

module.exports = userRouter;

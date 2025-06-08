import { Router } from "express";
import AuthController from "./Infraestructure/in/userController.js";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", authController.register.bind(authController));

export default authRouter;
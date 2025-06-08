import { Router } from "express";
import AuthController  from "./Infraestructure/in/userController.js";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login",authController.register);

export default authRouter;
import express from "express";
import morgan from "morgan";
import authRouter from "./auth/index.js";
import cors from "cors";
import { ErrorHandler } from "./errors/index.js";

//variables
const server = express();

//middlewares
server.use(express.json());
server.use(morgan("dev"));
server.use(cors());

//routes
server.use("/api/auth", authRouter);

// Middleware de manejo de errores (debe ir al final)
server.use(ErrorHandler.handle);

// Manejo de errores no capturados
process.on('uncaughtException', ErrorHandler.handleUncaughtException);
process.on('unhandledRejection', ErrorHandler.handleUnhandledRejection);

server.listen(3000, () => {
    console.log(`🚀 Server running on port 3000`);
});
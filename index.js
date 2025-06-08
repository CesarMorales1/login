import express from "express";
import morgan from "morgan";
import authRouter from "./auth/index.js";
import cors from "cors";

//variables
const server = express();

//middlewares
server.use(express.json());
server.use(morgan("dev"));
server.use(cors());

//routes
server.use(authRouter);

server.listen(3000, () => {
    console.log(`Escuchando en el puerto 3000`);
})

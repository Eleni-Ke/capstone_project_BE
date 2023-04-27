import Express from "express";
import cors from "cors";
import { badRequestHandler, genericErrorHandler } from "./errorHandlers";
import usersRouter from "./api/users";

const server = Express();

// ************************************* MIDDLEWARES **********************************
server.use(cors());
server.use(Express.json());

// ************************************** ENDPOINTS ***********************************
server.use("/users", usersRouter);

// ************************************* ERROR HANDLERS *******************************
server.use(badRequestHandler);
server.use(genericErrorHandler);

export default server;

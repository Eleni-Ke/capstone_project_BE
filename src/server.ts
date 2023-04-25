import Express from "express";
import cors from "cors";
import { badRequestHandler, genericErrorHandler } from "./errorHandlers";

const server = Express();

// ************************************* MIDDLEWARES **********************************
server.use(cors());
server.use(Express.json());

// ************************************** ENDPOINTS ***********************************

// ************************************* ERROR HANDLERS *******************************
server.use(badRequestHandler);
server.use(genericErrorHandler);

export default server;

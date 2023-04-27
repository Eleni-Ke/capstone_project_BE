import Express from "express";
import cors from "cors";
import { badRequestHandler, genericErrorHandler } from "./errorHandlers";
import usersRouter from "./api/users";
import charactersRouter from "./api/characters";
import placesRouter from "./api/places";

const server = Express();

// ************************************* MIDDLEWARES **********************************
server.use(cors());
server.use(Express.json());

// ************************************** ENDPOINTS ***********************************
server.use("/users", usersRouter);
server.use("/characters", charactersRouter);
server.use("/places", placesRouter);

// ************************************* ERROR HANDLERS *******************************
server.use(badRequestHandler);
server.use(genericErrorHandler);

export default server;

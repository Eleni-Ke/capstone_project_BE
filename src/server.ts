import Express from "express";
import cors from "cors";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./errorHandlers";
import usersRouter from "./api/users";
import charactersRouter from "./api/characters";
import placesRouter from "./api/places";
import passport from "passport";
import googleStrategy from "./lib/auth/googleAuth";
import notesRouter from "./api/notes";

const server = Express();

passport.use("google", googleStrategy);

// ************************************* MIDDLEWARES **********************************
server.use(cors());
server.use(Express.json({ limit: "25mb" }));

// ************************************** ENDPOINTS ***********************************
server.use("/users", usersRouter);
server.use("/characters", charactersRouter);
server.use("/places", placesRouter);
server.use("/notes", notesRouter);

// ************************************* ERROR HANDLERS *******************************
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

export default server;

import { RequestHandler } from "express";
import {
  checkSchema,
  Location,
  Schema,
  validationResult,
} from "express-validator";
import createHttpError from "http-errors";

const noteSchema: Schema<"isString" | "in"> = {
  title: {
    in: "body" as Location,
    isString: {
      errorMessage: "The title of note is mandatory and needs to be a string!",
    },
  },
  text: {
    in: "body" as Location,
    isString: {
      errorMessage: "The text of note is mandatory and needs to be a string!",
    },
  },
};

export const checkNoteSchema = checkSchema(noteSchema);

export const generateBadRequest: RequestHandler = (request, response, next) => {
  const errors = validationResult(request);
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during place validation", {
        errorsList: errors.array(),
      })
    );
  }
};

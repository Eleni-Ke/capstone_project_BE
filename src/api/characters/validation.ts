import createHttpError from "http-errors";
import { RequestHandler } from "express";
import {
  checkSchema,
  Schema,
  Location,
  validationResult,
} from "express-validator";

const characterSchema: Schema<"isString" | "in"> = {
  name: {
    in: "body" as Location,
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    },
  },
  description: {
    in: "body" as Location,
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a string!",
    },
  },
};

export const checkCharacterSchema = checkSchema(characterSchema);

export const generateBadRequest: RequestHandler = (request, response, next) => {
  const errors = validationResult(request);
  if (errors.isEmpty()) {
    next();
  } else {
    next(
      createHttpError(400, "Errors during character validation", {
        errorsList: errors.array(),
      })
    );
  }
};

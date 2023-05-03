import { RequestHandler } from "express";
import {
  checkSchema,
  Location,
  Schema,
  validationResult,
} from "express-validator";
import createHttpError from "http-errors";

const placeSchema: Schema<"isString" | "in"> = {
  placeName: {
    in: "body" as Location,
    isString: {
      errorMessage:
        "The name of the place is mandatory and needs to be a sting!",
    },
  },
  description: {
    in: "body" as Location,
    isString: {
      errorMessage:
        "Description is a mandatory field and needs to be a string!",
    },
  },
  creator: {
    in: "body" as Location,
    isString: {
      errorMessage: "Creator is a mandatory field and needs to be a string!",
    },
  },
};

export const checkPlaceSchema = checkSchema(placeSchema);

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

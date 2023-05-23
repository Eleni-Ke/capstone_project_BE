import { checkSchema, Location, Schema } from "express-validator";

const storySchema: Schema<"isString" | "in"> = {
  title: {
    in: "body" as Location,
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  event: {
    in: "body" as Location,
    isString: {
      errorMessage: "Event is a mandatory field and needs to be a string!",
    },
  },
};

export const checkStorySchema = checkSchema(storySchema);

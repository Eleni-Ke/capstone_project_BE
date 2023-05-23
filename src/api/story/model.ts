import mongoose from "mongoose";
import { StoryDocument, StoryModel } from "../../interfaces/IStory";

const { Schema, model } = mongoose;

const StorySchema = new Schema(
  {
    title: { type: String, required: true },
    event: { type: String, required: true },
    characters: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "characters",
      required: false,
    },
    places: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "places",
      required: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

StorySchema.methods.toJSON = function () {
  const currentStoryDocument = this;
  const currentStory = currentStoryDocument.toObject();
  delete currentStory.createdAt;
  delete currentStory.updatedAt;
  delete currentStory.__v;
  return currentStory;
};

export default model<StoryDocument, StoryModel>("story", StorySchema);

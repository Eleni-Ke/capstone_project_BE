import mongoose from "mongoose";
import { PlaceDocument, PlaceModel } from "../../interfaces/IPlaces";

const { Schema, model } = mongoose;

const PlacesSchema = new Schema(
  {
    placeName: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: false },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

PlacesSchema.methods.toJSON = function () {
  const currentPlaceDocument = this;
  const currentPlace = currentPlaceDocument.toObject();
  delete currentPlace.createdAt;
  delete currentPlace.updatedAt;
  delete currentPlace.__v;
  return currentPlace;
};

export default model<PlaceDocument, PlaceModel>("place", PlacesSchema);

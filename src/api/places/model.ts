import mongoose from "mongoose";
import { PlaceDocument, PlaceModel } from "../../interfaces/IPlaces";

const { Schema, model } = mongoose;

const PlacesSchema = new Schema(
  {
    placeName: { type: String, required: true },
    description: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export default model<PlaceDocument, PlaceModel>("place", PlacesSchema);

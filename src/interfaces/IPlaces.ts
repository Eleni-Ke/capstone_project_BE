import mongoose, { Model, Document } from "mongoose";

interface Place {
  placeName: string;
  description: string;
  images: string[];
  creator: mongoose.Types.ObjectId;
}

export interface PlaceDocument extends Place, Document {}

export interface PlaceModel extends Model<PlaceDocument> {}

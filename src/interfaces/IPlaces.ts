import { Model, Document } from "mongoose";

interface Place {
  placeName: string;
  description: string;
}

export interface PlaceDocument extends Place, Document {}

export interface PlaceModel extends Model<PlaceDocument> {}

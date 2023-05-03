import mongoose, { Model, Document } from "mongoose";

interface Character {
  name: string;
  descriptopm: string;
  images: string[];
  creator: mongoose.Types.ObjectId;
}

export interface CharacterDocument extends Character, Document {}

export interface CharacterModel extends Model<CharacterDocument> {}

import { Model, Document } from "mongoose";

interface Character {
  name: string;
  descriptopm: string;
}

export interface CharacterDocument extends Character, Document {}

export interface CharacterModel extends Model<CharacterDocument> {}

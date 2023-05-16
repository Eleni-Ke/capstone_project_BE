import mongoose from "mongoose";
import {
  CharacterDocument,
  CharacterModel,
} from "../../interfaces/ICharacters";

const { Schema, model } = mongoose;

const RelationshipSchema = new Schema({
  partner: { type: mongoose.Schema.Types.ObjectId, required: true },
  relationshipType: { type: String, required: true },
});

const CharactersSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    age: { type: String, required: false },
    appearance: { type: String, required: false },
    strengths: { type: String, required: false },
    weaknesses: { type: String, required: false },
    superPower: { type: String, required: false },
    images: { type: [String], required: false },
    relationships: { type: [RelationshipSchema], required: false },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    // limits: { fileSize: 1024 * 1024 * 10 },
  },
  { timestamps: true }
);

CharactersSchema.methods.toJSON = function () {
  const currentCharacterDocument = this;
  const currentCharacter = currentCharacterDocument.toObject();
  delete currentCharacter.createdAt;
  delete currentCharacter.updatedAt;
  delete currentCharacter.__v;
  return currentCharacter;
};

export default model<CharacterDocument, CharacterModel>(
  "character",
  CharactersSchema
);

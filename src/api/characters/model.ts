import mongoose from "mongoose";
import {
  CharacterDocument,
  CharacterModel,
} from "../../interfaces/ICharacters";

const { Schema, model } = mongoose;

const CharactersSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// CharactersSchema.methods.toJSON = function () {
//   const currentCharacterDocument = this;
//   const currentCharacter = currentCharacterDocument.toObject();
//   delete currentCharacter.createdAt;
//   delete currentCharacter.updatedAt;
//   delete currentCharacter.__v;
//   return currentCharacter;
// };

export default model<CharacterDocument, CharacterModel>(
  "character",
  CharactersSchema
);

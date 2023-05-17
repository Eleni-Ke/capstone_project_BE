import mongoose from "mongoose";
import { NoteDocument, NoteModel } from "../../interfaces/INotes";

const { Schema, model } = mongoose;

const NotesSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

NotesSchema.methods.toJSON = function () {
  const currentNoteDocument = this;
  const currentNote = currentNoteDocument.toObject();
  delete currentNote.createdAt;
  delete currentNote.updatedAt;
  delete currentNote.__v;
  return currentNote;
};

export default model<NoteDocument, NoteModel>("note", NotesSchema);

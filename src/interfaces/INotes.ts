import mongoose, { Model, Document } from "mongoose";

interface Note {
  title: string;
  text: string;
}

export interface NoteDocument extends Note, Document {}

export interface NoteModel extends Model<NoteDocument> {}

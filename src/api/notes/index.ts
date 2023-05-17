import Express, { NextFunction, Request, Response } from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { checkNoteSchema, generateBadRequest } from "./validation";
import NotesModel from "./model";
import createHttpError from "http-errors";

const notesRouter = Express.Router();

notesRouter.post(
  "/",
  checkNoteSchema,
  generateBadRequest,
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newNote = new NotesModel({
        ...req.body,
        creator: req.user?._id,
      });
      const { _id } = await newNote.save();
      console.log(_id);
      res.status(201).send(newNote);
    } catch (error) {
      next(error);
    }
  }
);

notesRouter.get(
  "/",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notes = await NotesModel.find({
        creator: req.user?._id,
      });
      res.send(notes);
    } catch (error) {
      next(error);
    }
  }
);

notesRouter.put(
  "/:noteId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedNote = await NotesModel.findOneAndUpdate(
        {
          _id: req.params.noteId,
          creator: req.user?._id,
        },
        req.body,
        { new: true, runValidators: true }
      );
      res.send(updatedNote);
    } catch (error) {
      next(error);
    }
  }
);

notesRouter.delete(
  "/:noteId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedNote = await NotesModel.findByIdAndDelete({
        _id: req.params.noteId,
        creator: req.user?._id,
      });
      if (deletedNote) {
        res.status(204).send();
      } else {
        next(createHttpError(404, "You don't have a note with that ID."));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default notesRouter;

import Express, { NextFunction, Request, Response } from "express";
import { checkCharacterSchema, generateBadRequest } from "./validation";
import CharactersModel from "./model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";

const charactersRouter = Express.Router();

charactersRouter.post(
  "/",
  checkCharacterSchema,
  generateBadRequest,
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newCharacter = new CharactersModel({
        ...req.body,
        // creator: req.user?._id,
      });
      const { _id } = await newCharacter.save();
      res.status(201).send({
        character: newCharacter,
        id: _id,
        creator: req.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.get(
  "/:userId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const characters = await CharactersModel.find({
        creator: req.params.userId,
      });
      res.send(characters);
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.get(
  "/:userId/:characterId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const character = await CharactersModel.find({
        _id: req.params.characterId,
        creator: req.params.userId,
      });
      res.send(character);
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.put(
  "/:userId/:characterId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedCharacter = await CharactersModel.findByIdAndUpdate(
        req.params.characterId,
        req.body,
        { new: true, runValidators: true }
      );
      res.send(updatedCharacter);
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.delete(
  "/:userId/:characterId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedCharacter = await CharactersModel.findByIdAndDelete(
        req.params.characterId
      );
      if (deletedCharacter) {
        res.status(204).send();
      }
    } catch (error) {
      next(error);
    }
  }
);

export default charactersRouter;

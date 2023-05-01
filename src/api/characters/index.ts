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
      const newCharacter = new CharactersModel(req.body);
      const { _id } = await newCharacter.save();
      res.status(201).send({
        character: newCharacter,
        id: _id,
      });
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.get(
  "/",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const characters = await CharactersModel.find();
      res.send(characters);
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.get(
  "/:characterId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const character = await CharactersModel.findById(req.params.characterId);
      res.send(character);
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.put(
  "/:characterId",
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
  "/:characterId",
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

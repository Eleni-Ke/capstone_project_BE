import Express, { NextFunction, Request, Response } from "express";
import { checkCharacterSchema, generateBadRequest } from "./validation";
import CharactersModel from "./model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Params } from "express-serve-static-core";
import { v2 as cloudinary } from "cloudinary";

const charactersRouter = Express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone/characters",
    } as Params,
  }),
}).single("characterImage");

charactersRouter.post(
  "/image/:characterId",
  JWTAuthMiddleware,
  cloudinaryUploader,
  async (req: Request, res, next) => {
    try {
      const character = await CharactersModel.findByIdAndUpdate(
        req.params.characterId,
        { $push: { images: req.file!.path } },
        { new: true, runValidators: true }
      );
      // avatar: req.file.path
      res.send({ character });
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.post(
  "/",
  checkCharacterSchema,
  generateBadRequest,
  JWTAuthMiddleware,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const newCharacter = new CharactersModel({
        ...req.body,
        // creator: req.user!._id,
      });
      const { _id } = await newCharacter.save();
      res.status(201).send({
        character: newCharacter,
        id: _id,
        creator: req.user?._id,
      });
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.get(
  "/",
  JWTAuthMiddleware,
  async (req: any, res: Response, next: NextFunction) => {
    try {
      const characters = await CharactersModel.find({
        creator: req.user!._id,
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

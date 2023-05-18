import Express, { NextFunction, Request, Response } from "express";
import { checkCharacterSchema, generateBadRequest } from "./validation";
import CharactersModel from "./model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Params } from "express-serve-static-core";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";

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
  "/:characterId/image",
  JWTAuthMiddleware,
  cloudinaryUploader,
  async (req: Request, res, next) => {
    try {
      const character = await CharactersModel.findByIdAndUpdate(
        {
          _id: req.params.characterId,
          crator: req.user?._id,
        },
        { $push: { images: req.file!.path } },
        { new: true, runValidators: true }
      );
      res.send({ character });
    } catch (error) {
      next(error);
    }
  }
);

charactersRouter.post(
  "/:characterId/relationship",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.relationships) {
        const updatedCharacter = await CharactersModel.findOneAndUpdate(
          {
            _id: req.params.characterId,
            creator: req.user?._id,
          },
          { $push: { relationships: req.body.relationships } },
          { new: true, runValidators: true }
        );
        req.body.relationships.map(async (relationship: any) => {
          const updatedPartner = await CharactersModel.findOneAndUpdate(
            {
              _id: relationship.partner,
              creator: req.user?._id,
            },
            {
              $push: {
                relationships: {
                  partner: req.params.characterId,
                  relationshipType: relationship.relationshipType,
                },
              },
            },
            { new: true, runValidators: true }
          );
          if (updatedPartner) {
            console.log("Relationship added to both partners!");
          } else {
            console.log(
              "There has been an issue updating the partners relationships..."
            );
          }
        });
        res.send(updatedCharacter);
      } else {
        next(createHttpError(404, "Please add relationships."));
      }
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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newCharacter = new CharactersModel({
        ...req.body,
        creator: req.user?._id,
      });
      const { _id } = await newCharacter.save();
      if (req.body.relationships) {
        req.body.relationships.map(async (relationship: any) => {
          const updatedCharacter = await CharactersModel.findOneAndUpdate(
            {
              _id: relationship.partner,
              creator: req.user?._id,
            },
            {
              $push: {
                relationships: {
                  partner: _id,
                  relationshipType: relationship.relationshipType,
                },
              },
            },
            { new: true, runValidators: true }
          );
          if (updatedCharacter) {
            console.log("Relationship added to both partners!");
          } else {
            console.log(
              "There has been an issue updating the partners relationships..."
            );
          }
        });
      }

      res.status(201).send({
        character: newCharacter,
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
  "/:characterId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const character = await CharactersModel.find({
        _id: req.params.characterId,
        creator: req.user?._id,
      });
      if (character) {
        res.send(character);
      } else {
        next(
          createHttpError(
            404,
            `Relationship with id: ${req.params.characterId} not found`
          )
        );
      }
    } catch (error) {
      console.log(`The error is: ${error}`);
      next(error);
    }
  }
);

charactersRouter.put(
  "/:characterId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedCharacter = await CharactersModel.findOneAndUpdate(
        {
          _id: req.params.characterId,
          creator: req.user?._id,
        },
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
      const deletedCharacter = await CharactersModel.findOneAndDelete({
        _id: req.params.characterId,
        creator: req.user?._id,
      });
      if (deletedCharacter) {
        const partnerIds = deletedCharacter.relationships.map(
          (relationship: any) => relationship.partner
        );
        await CharactersModel.updateMany(
          { _id: { $in: partnerIds } },
          { $pull: { relationships: { partner: req.params.characterId } } }
        );
        res.status(204).send();
      }
    } catch (error) {
      next(error);
    }
  }
);

export default charactersRouter;

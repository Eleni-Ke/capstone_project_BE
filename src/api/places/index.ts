import Express, { NextFunction, Request, Response } from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { checkPlaceSchema, generateBadRequest } from "./validation";
import PlacesModel from "./model";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Params } from "express-serve-static-core";
import { v2 as cloudinary } from "cloudinary";
import createHttpError from "http-errors";

const placesRouter = Express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "capstone/places",
    } as Params,
  }),
}).single("placeImage");

placesRouter.post(
  "/:placeId/image",
  JWTAuthMiddleware,
  cloudinaryUploader,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const place = await PlacesModel.findByIdAndUpdate(
        {
          _id: req.params.placeId,
          creator: req.user?._id,
        },
        { $push: { images: req.file!.path } },
        { new: true, runValidators: true }
      );
      res.send({ place });
    } catch (error) {
      next(error);
    }
  }
);

placesRouter.post(
  "/",
  checkPlaceSchema,
  generateBadRequest,
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPlace = new PlacesModel({
        ...req.body,
        creator: req.user?._id,
      });
      const { _id } = await newPlace.save();
      res.status(201).send({ place: newPlace, id: _id });
    } catch (error) {
      next(error);
    }
  }
);

placesRouter.get(
  "/",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const places = await PlacesModel.find({
        creator: req.user?._id,
      });
      res.send(places);
    } catch (error) {
      next(error);
    }
  }
);

placesRouter.get(
  "/:placeId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const place = await PlacesModel.findOne({
        _id: req.params.placeId,
        creator: req.user?._id,
      });
      res.send({ place });
    } catch (error) {
      next(error);
    }
  }
);

placesRouter.put(
  "/:placeId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedPlace = await PlacesModel.findOneAndUpdate(
        {
          _id: req.params.placeId,
          creator: req.user?._id,
        },
        req.body,
        { new: true, runValidators: true }
      );
      res.send(updatedPlace);
    } catch (error) {
      next(error);
    }
  }
);

placesRouter.delete(
  "/:placeId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedPlace = await PlacesModel.findOneAndDelete({
        _id: req.params.placeId,
        creator: req.user?._id,
      });
      if (deletedPlace) {
        res.status(204).send();
      } else {
        next(createHttpError(404, "You don't have a place with that ID."));
      }
    } catch (error) {
      next(error);
    }
  }
);

export default placesRouter;

import Express, { NextFunction, Request, Response } from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { checkPlaceSchema, generateBadRequest } from "./validation";
import PlacesModel from "./model";

const placesRouter = Express.Router();

placesRouter.post(
  "/",
  checkPlaceSchema,
  generateBadRequest,
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPlace = new PlacesModel(req.body);
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
      const places = await PlacesModel.find();
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
      const place = await PlacesModel.findById(req.params.placeId);
      res.send(place);
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
      const updatedPlace = await PlacesModel.findByIdAndUpdate(
        req.params.placeId,
        req.body,
        { new: true, runValidators: true }
      );
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
      const deletedPlace = await PlacesModel.findByIdAndDelete(
        req.params.placeId
      );
      if (deletedPlace) {
        res.status(204).send();
      }
    } catch (error) {
      next(error);
    }
  }
);

export default placesRouter;

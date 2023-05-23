import Express, { NextFunction, Request, Response } from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { generateBadRequest } from "../characters/validation";
import { checkStorySchema } from "./validation";
import StoriesModel from "./model";

const storyRouter = Express.Router();

storyRouter.post(
  "/",
  checkStorySchema,
  generateBadRequest,
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newStory = new StoriesModel({
        ...req.body,
        creator: req.user?._id,
      });
      const { _id } = await newStory.save();
      res.status(201).send({
        story: newStory,
        id: _id,
      });
    } catch (error) {
      next(error);
    }
  }
);

storyRouter.get(
  "/",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stories = await StoriesModel.find({
        creator: req.user!._id,
      });
      res.send(stories);
    } catch (error) {
      next(error);
    }
  }
);

storyRouter.put(
  "/:storyId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedStory = await StoriesModel.findOneAndUpdate(
        {
          _id: req.params.storyId,
          creator: req.user?._id,
        },
        req.body,
        { new: true, runValidators: true }
      );
      res.send(updatedStory);
    } catch (error) {
      next(error);
    }
  }
);

storyRouter.delete(
  "/:storyId",
  JWTAuthMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedStory = await StoriesModel.findOneAndDelete({
        _id: req.params.storyId,
        creator: req.user?._id,
      });
      if (deletedStory) {
        res.status(204).send();
      }
    } catch (error) {
      next(error);
    }
  }
);

export default storyRouter;

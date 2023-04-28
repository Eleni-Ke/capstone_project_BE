import Express, { NextFunction, Request, Response } from "express";
import { checkUserSchema, generateBadRequest } from "./validation";
import UsersModel from "./model";
import { createAccessToken } from "../../lib/auth/tools";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";

const usersRouter = Express.Router();

usersRouter.post(
  "/account",
  checkUserSchema,
  generateBadRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = new UsersModel(req.body);
      const { _id } = await newUser.save();
      const payload = { _id: _id };
      const accessToken = await createAccessToken(payload);
      res.status(201).send({ user: newUser, accessToken: accessToken });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/session",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await UsersModel.checkCredentials(email, password);
      if (user) {
        const payload = { _id: user._id };
        const accessToken = await createAccessToken(payload);
        res.send({ accessToken, user });
      } else {
        next(createHttpError(401, "Credentials are not valid."));
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/account", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const user = await UsersModel.findById(req.user!._id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/account", JWTAuthMiddleware, async (req: any, res, next) => {
  try {
    const updatedUser = await UsersModel.findByIdAndUpdate(
      req.user!._id,
      req.body,
      { new: true, runValidators: true }
    );
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;

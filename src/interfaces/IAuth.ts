import { Request } from "express";

export interface TokenPayload {
  _id: import("mongoose").Types.ObjectId;
}

export interface UserRequest extends Request {
  user?: TokenPayload;
}

import { Model, Document } from "mongoose";

interface User {
  username: string;
  email: string;
  password: string;
}

interface UserDocument extends User, Document {}

interface UserModel extends Model<UserDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
}

declare namespace Express {
  interface Request {
    user: UserDocument;
  }
}

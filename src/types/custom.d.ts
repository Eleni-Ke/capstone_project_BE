declare namespace Express {
  interface Request {
    user?: { _id?: import("mongoose").Types.ObjectId };
  }
}
interface User {
  username: string;
  email: string;
  password: string;
  // _id?: import("mongoose").Types.ObjectId
}

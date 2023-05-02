interface User {
  username: string;
  email: string;
  password: string;
  _id?: import("mongoose").Types.ObjectId;
}

interface UserMethods {
  checkCredentials(email: string, password: string): Promise<User | null>;
}

import { IncomingMessage, ServerResponse } from "http";

export type AdType = {
  id: number;
  title: string;
  description?: string;
  owner: string;
  price: number;
  picture: string;
  location: string;
  createdAt: string;
};

export type Category = {
  id: number;
  name: string;
};

export type TagType = {
  id: number;
  name: string;
};

export type UserType = {
  id: number;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: RoleType;
};

export type ContextType = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
};

export type AuthContextType = ContextType & { user: UserType };

// export type Role = "admin" | "moderator" | "user";

export enum RoleType {
  USER = "user",
  ADMIN = "admin"
}

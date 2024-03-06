import { User } from "@prisma/client";
// import bcrypt = require('bcrypt');
import * as bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";

import * as jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "./prisma/db.setup";
import * as dotenv from "dotenv";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
// console.log(jwtSecret)

const saltRounds = 11;

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const createUnsecuredUserInformation = (user: User) => ({
  username: user.username,
  id: user.id,
});

export const createTokenForUser = (user: User) => {
  return jwt.sign(createUnsecuredUserInformation(user), jwtSecret!);
};

const jwtInfoSchema = z.object({
  username: z.string(),
  iat: z.number(),
});

// this gets the data from auth token created from the headers from authorization
export const getDataFromAuthToken = (token?: string) => {
  if (!token) return null;
  try {
    // this zod schema is going to parse out the type and it will scream if it's not the string and number that it is expecting/ proper data type
    return jwtInfoSchema.parse(jwt.verify(token, jwtSecret!));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// this helper function makes sure the person logging in
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // this finds the token from the user when trying to create a coffee
  // *JWT HANDLING STUFF BELOW
  const [, token] = req.headers.authorization?.split?.(" ") || [];
  const myJWTData = getDataFromAuthToken(token);
  if (!myJWTData) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  const userFromJWt = await prisma.user.findFirst({
    where: {
      username: myJWTData.username,
    },
  });
  // console.log(userFromJWt, 'userFromJWT');
  if (!userFromJWt) {
    return res.status(401).json({ message: "User not Found" });
  }
  (req as any).user = userFromJWt;
  next();

  // *JWT HANDLING STUFF ABOVE
};
import { emailFormatChecker } from "../helperFunctions/checker.js";
import { writeFile } from "../helperFunctions/writeTextFile.js";
import { readFile } from "../helperFunctions/readTextFile.js";
import bcrypt from "bcrypt";
import config from "../config.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

//user registration
export const userRegister = async (request, response, next) => {
  try {
    if (!emailFormatChecker(request.body.email)) { //checking email format
      response.status(530);
      return next(new Error("Invalid Email address."));
    }
    let data = await readFile("../database/userDatabase.txt"); // fetching all users
    const hashedPassword = await bcrypt.hash( //hashing the password with the salt value and bcrypt
      request.body.password,
      config.saltValue
    );
    const newUser = {
      id: crypto.randomBytes(16).toString("hex"),
      userName: request.body.userName,
      email: request.body.email,
      password: hashedPassword,
    };
    if (data) { // when users are present in file
      const user = data.find((item) => item.email === request.body.email); // checking the email exists or not
      if (user) {
        response.status(409);
        return next(new Error("Email already registered"));
      }
      data = [...data, newUser];
      const result = await writeFile("../database/userDatabase.txt", data); // adding the new user
      if (result === false) {
        response.status(400);
        return next(new Error("Failed to register user"));
      } else {
        return response.status(200).json({
          message: "User has been registered succesfully",
          success: true,
        });
      }
    } else { // when file is empty
      const result = await writeFile("../database/userDatabase.txt", [newUser]);
      if (result === false) {
        response.status(400);
        return next(new Error("Failed to register user"));
      } else {
        return response.status(200).json({
          message: "User has been registered succesfully",
          success: true,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//User Login
export const userLogin = async (request, response, next) => {
  try {
    if (!emailFormatChecker(request.body.email)) { //checking email format
      response.status(530);
      return next(new Error("Invalid email address"));
    }
    const data = await readFile("../database/userDatabase.txt"); // fetching all users
    if (data) {
      const user = data.find((item) => item.email === request.body.email); //checking email exists or not
      if (user) {
        if (await bcrypt.compare(request.body.password, user.password)) { //comparing the password
          const secret = config.jwtSecret + user.password; //making the secret value will be added to payload to make token
          const payload = {
            id: user.id,
            email: user.email,
          };
          const token = jwt.sign(payload, secret, { //using jwt.sign token is made with payload and secret
            expiresIn: "2h",
          });
          return response.status(200).json({ //response is sent to user with token
            userDetails: user,
            token: token,
            message: "valid user",
            success: true,
          });
        } else {
          response.status(401);
          return next(new Error("Wrong Password."));
        }
      } else {
        response.status(401);
        return next(new Error("User not found."));
      }
    } else {
      response.status(401);
      return next(new Error("User not found."));
    }
  } catch (error) {
    return next(error);
  }
};

//user validation
export const userValidation = async (request, response, next) => {
  const token = request.get("Authorization"); // token is sent in header section for authorization
  const { id } = request.params; //got user id by parameters
  try {
    const data = await readFile("../database/userDatabase.txt"); //fetching all data
    if (data) { 
      const user = data.find((item) => item.id === id); //finding that particular user
      if (user) {
        const secret = config.jwtSecret + user.password; //making a secret with jwtsecret key and user password
        try {
          jwt.verify(token, secret); //jwt verify is used to verify the token we got and the secret we made
          return response.status(200).json({ //success response is sent if validated
            data: user,
            token: token,
            message: "User verified",
            success: true,
          });
        } catch (error) {
          response.status(403);
          return next(new Error("Not authenticated Please try again"));
        }
      } else {
        response.status(401);
        return next(new Error("User not found."));
      }
    } else {
      response.status(401);
      return next(new Error("User not found."));
    }
  } catch (error) {}
};

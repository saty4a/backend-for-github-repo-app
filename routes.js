import express from "express";
import { addTask, getAllTasks, getUserTask } from "./controllers/taskFunctions.js";
import { userLogin, userRegister, userValidation } from "./controllers/userFunction.js";

export const app = express();

//user post routes
app.post("/user/register", userRegister);
app.post("/user/login", userLogin);

//user get routes
app.get("/user/validation/:id", userValidation);

//task post routes
app.post("/task/add-new-task", addTask);

//task get routes
app.get("/task/user-task/:id", getUserTask);
app.get("/task/all-tasks", getAllTasks);

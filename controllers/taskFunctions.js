import crypto from "crypto";
import { writeFile } from "../helperFunctions/writeTextFile.js";
import { readFile } from "../helperFunctions/readTextFile.js";

//add a task
export const addTask = async (request, response, next) => {
  try {
    const obj = { //making a obj of task
      id: crypto.randomBytes(16).toString("hex"),
      ownerId: request.body.ownerId,
      title: request.body.title,
    };
    let data = await readFile("../database/taskDatabase.txt"); //fetching all data from file
    if (data) { //when data is present in file
      data = [...data, obj];
      const result = await writeFile("../database/taskDatabase.txt", data); //writing the data in the file
      if (result === false) {
        response.status(400);
        return next(new Error("Failed to take create new task"));
      } else {
        return response.status(200).json({
          data: result,
          message: "Task created successfully.",
          success: true,
        });
      }
    } else { //when data is not present in file
      const result = await writeFile("../database/taskDatabase.txt", [obj]);
      if (result === false) {
        response.status(400);
        return next(new Error("Failed to take create new task"));
      } else {
        return response.status(200).json({
          data: result,
          message: "Task created successfully.",
          success: true,
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

//get all tasks of the user
export const getUserTask = async (request, response, next) => {
  try {
    const { id } = request.params; // get the user id from paramters
    const data = await readFile("../database/taskDatabase.txt"); //fetch all tasks
    if (data) {
      const result = data.filter((item) => item.ownerId === id); //find tasks that belongs to that user
      return response.status(200).json({ //send response
        data: result,
        message: "user all Tasks",
        success: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};

//get all tasks present in file
export const getAllTasks = async (request, response, next) => {
  try {
    const data = await readFile("../database/taskDatabase.txt"); //fetch all tasks from file
    if (data) {
      return response.status(200).json({ // send response
        data: data,
        message: "All Tasks",
        success: true,
      });
    }
  } catch (error) {
    return next(error);
  }
};
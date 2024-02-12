import express from "express";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";
import * as routers from "./routes.js";
import config from "./config.js";
const app = express();
app.use(cors());
app.use(express.json());

app.use(routers.app)

app.use((request, response, next) => {
    next(new Error("api working"));
})

app.use(errorHandler);

export const server = app.listen(config.port, () => {
    console.log(`Server is running at port ${config.port}`);
})
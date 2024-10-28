const express = require("express");
const connectToDb = require("./DB/dbService");
const corsMiddleware = require("./middlewares/cors")
const router = require("./router/router");
const { handleError } = require("./utils/handleErrors");
const chalk = require("chalk");
const loggerMiddleware = require("./logger/loggerService");
const { initializeDatabase } = require("./initialData/initialDataService");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT || 8181;

app.use(corsMiddleware);
app.use(express.json());
app.use(express.static("./public"));

app.get("/", (req, res) => {
    const myPassword = process.env.PASSWORD2;
    res.send(myPassword);
});

app.use(loggerMiddleware);
app.use(router);
app.use((err, req, res, next) => {
    const message = err || "internal error of the server";
    return handleError(res, 500, message);
});

app.listen(PORT, async () => {
    console.log(chalk.yellow("app is listening to port " + PORT));
    await connectToDb();
    await initializeDatabase();
});
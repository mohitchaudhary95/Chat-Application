require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db/db.js");
const userRoute = require("./routes/userRoute.js");
const avatarRoute = require("./routes/avatarRoute.js");
const cookieParser = require('cookie-parser');
const createWebSocketServer = require("./wsServer.js");

//database connection
connection();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

app.use("/api/user", userRoute);
app.use("/api/avatar", avatarRoute);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Application Running on Port ${port}`));

createWebSocketServer(server);
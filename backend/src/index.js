import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import path from "path";

//const app = express();  here we commented this app because we've already created server in socket.js and now we'll use that in our index.js

dotenv.config();//const app = express();  here we commented this app because we've already created server in socket.js and now we'll use that in our index.js

const PORT = process.env.PORT;

const _dirname = path.resolve();//this will give us path of backend folder.

console.log(_dirname);

app.use(express.json({ limit: '10mb' })); // this middleware limit is increasing backend image size limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

//app.use(express.json());//this middlewares helps us to extract json data from user's body.

app.use(cookieParser());

//CORS allows or restricts requests made from one domain (origin) to another. like here we are gving port no. of frontend in cors so that frontend code can make access to backened api server.
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(express.static(path.join(_dirname, "./frontend/dist")));//with this line, we're joining frontend and backend path.

app.get(/^\/(?!api).*/, (req, res) => { //for frontend routes
  res.sendFile(path.join(_dirname, "./frontend", "dist", "index.html"));
});


//below we converted app.listen to server.listen as because we'll use now socket io server coming from socket.js.
server.listen(PORT, () => {
    console.log("server started at port:" + PORT);
    connectDB();
})

//servers send token to clients at the time of both login and signup
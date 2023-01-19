import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import adminRoutes from "./routes/adminRoutes.js";
import { createPost } from "./controller/posts.js";
import { verifyToken } from "./middleware/auth.js";
import ChatRoute from "./routes/ChatRoute.js";
import MessageRoute from "./routes/MessageRoute.js";
import { editprofilepic } from "./controller/users.js";


import User from "./models/User.js";
import post from "./models/Post.js";
import { users ,posts} from "./data/index.js";

//CONFIGURATIONS//

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(cors());
// app.options("*",cors())
const httpServer = createServer(app);
import { createServer } from "http";
import { Server } from "socket.io";
import { register, sendOtp } from "./controller/auth.js";


const io = new Server(httpServer, {
    cors: {
        origin: ["https://socialpedia.fashionnova.store:3000", "http://localhost:3000", "https://socialpedia.fashionnova.store"],
    },
})


// const io = new Server(httpServer,{
//   cors: {
//       origin: [
//         // "https://ed.ednox.shop:3000"
//       , "https://socialpedia.fashionnova.store",
//       "http://localhost:3000"
//       // "https://ed.ednox.shop"
//     ],
//   },
// })



let activeUsers = [];


io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
      // if user is not added previously
      if (!activeUsers.some((user) => user.userId === newUserId)) {
          activeUsers.push({ userId: newUserId, socketId: socket.id });
          console.log("New User Connected", activeUsers);
      }
      // send all active users to new user
      io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
      // remove user from active users
      activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
      console.log("User Disconnected", activeUsers);
      // send all active users to all users
      io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
      const { receiverId } = data;
      const user = activeUsers.find((user) => user.userId === receiverId);
      console.log("Sending from socket to :", receiverId)
      console.log("Data: ", data)
      if (user) {
          io.to(user.socketId).emit("recieve-message", data);
      }
  });
})


app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(express.static("public"));
// app.use("/images", express.static("./public/assets"));
// app.use(
//   "/assets",
//   express.static(path.join(__dirname, "public/assets"))
// );

// // filestorage//

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// app.use('/assets', express.static(path.join(__dirname, './public/assets')));

app.use(express.static('public'))
app.use('/assets',express.static("assets"))

//FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/gif" ||
      file.mimetype.startsWith("image/" || file.mimetype.startsWith("video/"))
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type!"), false);
    }
  },
});

//routes with files//
app.post("/auth/register", upload.single("picture"), register);
app.post("/send-otp", sendOtp);

app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/users/profilepic-user/:id",  upload.single("picture"),editprofilepic)
app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

// app.use("/admin",adminRoutes);
//mongooose

app.use(function (err, req, res, next) {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "null" : err.stack,
  });
});

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`server port:${PORT}`));
    //add data one time
    //  User.insertMany(users);
    //  post.insertMany(posts);
  })
  .catch((error) => console.log(`${error}did not connect`));

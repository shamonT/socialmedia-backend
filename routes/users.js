import express from "express";
import { resetPassword } from "../controller/auth.js";

import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateUser,
  searchUser,
  editprofilepic,
  sendpasswordlink,
  
 
 
 
  
  
  
  
} from "../controller/users.js";

import { verifyToken } from "../middleware/auth.js";

// import { sendpasswordlink } from "../controllers/Services/nodeMailer.js";

const router = express.Router();

//read

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

router.patch("/:id/:friendId", addRemoveFriend);
router.put('/edit-user/:id', updateUser)

router.get('/search/user/:search', searchUser)
// router.get('/search',verifyToken,searchUser)
router.post("/profilepic-user/:id", editprofilepic)

router.post("/reset-password",sendpasswordlink)
router.post('/resetpassword',resetPassword);
export default router;

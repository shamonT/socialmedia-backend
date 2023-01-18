import User from "../models/User.js";
import Jwt from "jsonwebtoken";
import nodeMailer from "nodemailer"
// const mongoose = require('mongoose');
import mongoose from "mongoose";
import { otpSend } from "../Services/nodeMailer.js";
import expressAsyncHandler from "express-async-handler";
/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
      const { id, friendId } = req.params
      const user = await User.findById(id)
      console.log(user,'heyy')
      const friend = await User.findById(friendId)
      console.log(id, friendId ,'jjjjjjjjjjjjjjjjjjjjjjjjjjjj');
      if (user.friends.includes(friendId)) {
        console.log('firsttttttttttttttttttt');
        console.log(user.friends,'hahhaha')
        user.friends = user.friends.filter((id) => id !== friendId)
        console.log(user.friends,'endi second')
          friend.friends = friend.friends.filter((id) => id !== id)
      } else {
        console.log('elseeeeeeeeeeeeeeeeeeeeeeeeeeee');
          user.friends.push(friendId);
          friend.friends.push(id);
      }
      await user.save();
      await friend.save();


      const friends = await Promise.all(
          user.friends.map((id) => User.findById(id))
      )
      const formattedFriends = friends.map(
          ({ _id, firstName, lastName, occupation, location, picturePath }) => {
              return { _id, firstName, lastName, occupation, location, picturePath };
          }
      );

      res.status(200).json(formattedFriends)

  } catch (err) {
      res.status(404).json({ message: err.message });
  }
}
export const updateUser = async (req, res) => {
  const id = req.params.id;
  console.log( req.body,"Data Received")
   
  let { _id,
      firstName,
      lastName,
      location,
      
      occupation } = req.body;
      


      
console.log(req.body,'req.bodyreq.body');
  if (id === _id) {
      try {

          const user = await User.findByIdAndUpdate(id, req.body, {
              new: true,
          });
          const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET);


          console.log({ user })
          res.status(200).json({ user, token, success: true, });
      } catch (error) {
          console.log(error, "Error ")
          res.status(400).json(error, 'hello');
      }
  } else {
      res
          .status(403)
          .json("Access Denied! You can update only your own Account.");
  }
};
//  (req, res) => {

 export const searchUser = async (req, res, next) => {
  try {
      let key = req.params.search
      console.log(key,'keykeykeykey');
      let searchKey = new RegExp(`/^${key}/i`)
      await User.aggregate([
          {
              $match: {
                  $or: [
                    { _id: { $regex: key, $options: 'si' } },
                    { picturePath: { $regex: key, $options: 'si' } },
                   
                      { firstName: { $regex: key, $options: 'si' } },
                      { lastName: { $regex: key, $options: 'si' } },
                  ]
              }
          },
          {
              $project: {
                   urId: 1,  picturePath: 1, firstName: 1, lastName: 1
              }
          }
      ]).then((user) => {
          res.status(201).json({ status: true, result: user, message: 'get search result' })
      }).catch((error) => {
          res.status(400).json({ status: false, message: 'some error' })
      })
  } catch (error) {

  }
}
// export const editprofilepic - async (req, res) ">(
//   const id reg.params.id;
//   1/ console.log("Data Received", req.body)
//   const picturepath
//   req.body;
//   try (
//   const user - await user. findByIdandupdate( id, req.body, (
//   new: true,
//   D:
//   const token - jwt. sign(( id: user.id ), process.env. JMt _ SECRET
//   console. log(f user ))
//   res.status (260). json( [ user, token, success: true ));
//   ) catch (error) (
//   console. log(error, "Error
//   res.status (400).jsonferror, 'hello');


export const editprofilepic=async (req, res) => {
  const id=req.params.id;
  console.log(id,'ididid');
  console.log(req.body,'ddddd');
  const picturePath=req.body;
  console.log(picturePath,'');
  try {
    const user=await User.findByIdAndUpdate(id,req.body,{
      new: true,
    })
    const token=Jwt.sign({id:user.id},process.env.JWT_SECRET)
    res.status(200).json({user,token,success:true})
  } catch (error) {
    res.status(400).json(error,'error')
  }

}


 export const sendpasswordlink = async (req, res) => {
  try {
      const { 
          email
         } = req.body;


      console.log(req.body, 'fisrt emailllll');
      const emailExist = await User.findOne({ email: email });

      if (emailExist) {
          otpSend(email)
              .then((response) => {
                  console.log(response, 'kkkkkkkkkkkkkkkkkkkk');
                  res.status(200).send({
                      message: "OTP sent",
                      response: response,
                      success: true
                  });
              })
              .catch((err) => console.log("ERROR", err));
      }else{
        res.status(401).json({ message:"email not found"})
      }
  } catch (err) {
      console.log(err);
      res.status(500).send({ success: false });
  }
};

//  export const resetPassword = expressAsyncHandler(async (req, res) => {
//   console.log("RESET PASSWORD CALL AT SERVER");
//   const userId = req.params.id;
//   const { password } = req.body;
//   console.log(userId, "............", password);
//   if (!userId || !password) {
//     res.status(400);
//     throw new Error("Please add all fields.");
//   }
//   const user = await User.findById(userId);
//   console.log(user, "userrrrrrr11");
//   if (!user) {
//     res.status(400);
//     throw new Error("User not found.");
//   }
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   const updatedUser = await User.findByIdAndUpdate(userId, {
//     $set: { password: hashedPassword },
//   });
//   console.log("user password updated");
//   if (!updateUser) {
//     res.status(400);
//     throw new Error("Error updating user.");
//   }
//   res.status(200).json({
//     status: "success",
//     message: "Password changed successfully",
//   });
// });
        




      

        
   
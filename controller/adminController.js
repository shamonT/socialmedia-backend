import Admin from "../models/adminModel.js";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import post from "../models/Post.js";

export const registerAdmin = asyncHandler(async (req, res) => {
  console.log("Register admin called");
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  if (admin) {
    res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const loginAdmin = asyncHandler(async (req, res) => {
  console.log("Login admin called");

  const { email, password } = req.body;

  // Check for user email
  const admin = await Admin.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const generateToken = (id) => {
  return Jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30s",
  });
};

export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users,'jhh');
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json("error");
  }
};
export const blockUser = async (req, res) => {
  try {
    console.log(req.body.userId, "req.body.id");
    const userId = req.body.userId;
    console.log(userId,'kkkkk');
    await User.updateOne(
      { _id: userId },
      {
        $set: {
          Active: false,
        },
      }
    );
    res.status(201).json({ blockStatus: true });
  } catch (error) {
    res.status(404).json("error occured");
  }
};
export const unblockUser = async (req, res) => {
  try {
    console.log(req.body.userId,'kkkkkkkkkk');
    const userId = req.body.userId;
    const user = await User.findById(userId)
    console.log(user,'2323323232')
    await user.updateOne({
      $set: {
        Active: true,
      },
    })
      
    res.status(201).json({ blockStatus: false });
  } catch (error) {
    res.status(404).json("error occured");
  }
};

//  export const getAllReports = async (req, res) => {
//   try {
//     console.log('fgdgdfgdf');
//       await post.find({},{reports:1}).then((result) => {
//         console.log(result,'resultresult');
//           res.status(201).json({ status: true, reports: result, message: 'get all reports' })
//       })
//   } catch (error) {

//   }
// }


// export const getAllReports = async (req, res) => {
//   try {
//     console.log('fgdgdfgdf');
//       await post.find({},{reports:1}).then((result) => {
//         console.log(result,'resultresult');
//           res.status(201).json({ status: true, reports: result, message: 'get all reports' })
//       })
//   } catch (error) {

//   }
// }
export const getAllReports = async (req, res, next) => {
  try {
      await post.find({ reportCount: { $not: { $eq: 0 } } }).then((result) => {
        console.log(result,'resultresultresultresult');
          res.status(201).json({ status: true, reports: result, message: 'get all reports' })
      })
  } catch (error) {

  }
}



export const removePost = async (req, res) => {
  try {
    console.log(req.body, "req.paramsreq.params");
    const { postId } = req.body;
    await post.deleteOne({ postId }).then((response) => {
      console.log(response, "response");
      res.status(200).json({ success: true, postId, message: "Post removed" });
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Can't delete post" });
  }
};
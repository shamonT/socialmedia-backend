import nodeMailer from "nodemailer"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import User from "../models/User.js";
import Jwt from "jsonwebtoken";
// import User from "../models/User";
dotenv.config()

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.FROM_PASSWORD,
  },
});

export const otpSend = (email) => {
  try {
    console.log(email, 'emaillllllll');
    // console.log(transporter,"TRANSPORTER")
    return new Promise(async (resolve, reject) => {
      const otp = `${Math.floor(10000 + Math.random() * 99999)}`;
      console.log(otp, 'otpppp');
      const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Verify your email ",
        html: `Your email verification code is : ${otp}`,

      };
      console.log('heloooooooooooooo');
      await transporter
        .sendMail(mailOptions)
        .then((response) => {
          console.log(response, 'ppppppppppppppppppp');
          response.otp = otp;
          resolve(response);
        })
        .catch((err) => {
          console.log("ERROR OTP")
          console.log(err, 'eroorrrrr');
          resolve(err);
        });
    }).catch((err) => {
      reject(err);
    });
  } catch (err) {
    console.log("ERROR OCCURRED", err);
  }
};

//send email link to reset password
// export const sendEmail =async(req,res)=>{
//     //  crypto.randomBytes(32,(err,buffer)=>{
//     //      if(err){
//     //          console.log(err)
//     const {email}=req.body
//     console.log(email);
//     await User.findOne({email:email},process.env.JWT_SECRET)
//          .then(user=>{
//           if(!user){
//               return res.status(422).json({error:"User dont exists with that email"})
//           }else{
//           console.log(user,'process.env');
//     // const token = Jwt.sign({ id: user._id }, );
        
//             //  user.resetToken = token
//             //  user.expireToken = Date.now() + 3600000
           
//              user.save().then((result)=>{
//               const otp = `${Math.floor(10000 + Math.random() * 99999)}`;
//               console.log(otp, 'otpppp');
//               const mailOptions = {
//                 from: process.env.FROM_EMAIL,
//                 to: email,
//                 subject: "Verify your email ",
//                 html: `Your email verification code is : ${otp}`,
        
//               };
//               transporter
//               .sendMail(mailOptions)
//               res.status(201).json({message:"check your email",
//               result:result
//             })
//              })
//             }

//          })
//      }


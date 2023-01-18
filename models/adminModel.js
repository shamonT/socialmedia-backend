import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema(
  
    {
      name: {
        type: String,
        required: [true, 'Please add a name'],
      },
      email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
      },
    },
    {
      timestamps: true,
    }
  )
  
 
const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;

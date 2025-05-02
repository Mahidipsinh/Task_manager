import e from "cors"
import Task from "../models/Task.js"
import User from "../models/User.js"
import bcrypt from "bcryptjs"

export const getUsers = async (req, res) => {
    try {
      const users = await User.find({ role: "member" }).select("-password");
  
      const usersWithTaskCounts = await Promise.all(
        users.map(async (user) => {
          const pendingTasks = await Task.countDocuments({
            assingnedTo: user._id,
            status: "pending",
          });
  
          const inProgressTasks = await Task.countDocuments({
            assingnedTo: user._id,
            status: "In Progress",
          });
  
          const completedTasks = await Task.countDocuments({
            assingnedTo: user._id,
            status: "Completed",
          });
  
          return {
            ...user._doc,
            pendingTasks,
            inProgressTasks,
            completedTasks,
          };
        })
      );
  
      res.json(usersWithTaskCounts);
  
    } catch (error) {
      res.status(500).json({ message: "server error", error: error.message });
    }
  };
  

export const getUserById=async (req,res)=>{
    try {
        const user=await User.findById(req.params.id).select("-password");
        if(!user){
           return res.status(404).json({message:"user not found"});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"server error",error:error.message});
    }
};



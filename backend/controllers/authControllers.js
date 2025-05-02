import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const generateToken=(userId)=>{
      return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
}

export const registerUser=async (req,res)=>{
   try {
      const {name,email,password,profileImageUrl,adminInviteToken}=req.body;

      const userExists=await User.findOne({email});

      if(userExists){
         return res.status(400).json({message:"user already exists"});       
      }

      let role="member";

      if(adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN){
         role="admin";
      }

      
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password,salt);

  
      const user =await User.create({
         name,
         email,
         password:hashedPassword,
         profileImageUrl,
         role,
      });

      res.status(201).json({
         _id:user._id,
         name:user.name,
         email:user.email,
         role:user.role,
         profileImageUrl:user.profileImageUrl,
         token:generateToken(user._id),
      });

   } catch (error) {
     res.status(500).json({message:"Server error",error:error.message});
   }
};


export const loginUser=async(req,res)=>{
   try {
      const {email,password}=req.body;

      const user=await User.findOne({email});

      if(!user){
         return res.status(401).json({message:"invalid email or password"});
      }

      const isMatch=await bcrypt.compare(password,user.password);

      if(!isMatch){
         return res.status(401).json({message:"invalid email or password"});
      }

      res.json({
         _id: user._id,
         name:user.name,
         email:user.email,
         role:user.role,
         profileImageUrl:user.profileImageUrl,
         token:generateToken(user._id)
      })

   } catch (error) {
      res.status(500).json({message:"Server error",error:error.message});
   }
};

export const getUserProfile=async(req,res)=>{
   try {
      const user=await User.findById(req.user.id).select("-password");
      if(!user){
         return res.status(404).json({message:"user not found"});
      }
      res.json(user);
   } catch (error) {
       return res.status(500).json({message:"server error",error:error.message});
   }
};

export const updateUserProfile=async(req,res)=>{
     const user=await User.findById(req.user.id);

     if(!user){
         return res.status(404).json({message:"user not found"});
     }

     user.name=req.body.name || user.name;
     user.email=req.body.email || user.email;

     if(req.body.password){
      const salt=await bcrypt.genSalt(10);
      user.password=await bcrypt.hash(req.body.password,salt);
     }

     const updatedUser=await user.save();

     res.json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      role:updatedUser.role,
      token:generateToken(updatedUser._id),
     });
};


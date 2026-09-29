const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenblacklisting.model");

/**
 * @name registerUserController
 * @description Controller function to handle user registration expect name, email & password
 * @route POST /api/auth/register
 * @access Public
 */
async function registerUserController(req, res) {
    const { name ,email, password,mobile, bloodgrp, emergencyContacts, emergencyEmails } = req.body;
    if(!name || !email || !password || !mobile || !bloodgrp || !emergencyContacts || !emergencyEmails){
        return res.status(400).json({message : "All the fields are required"});
    }

    const isUserExists = await User.findOne({email});
    if(isUserExists){
        return res.status(400).json({message : "user already exists"});
    }

    
    // hashed password before saving to the database for security reasons.
    const hashedpassword = await bcrypt.hash(password , 12);

    const newUser = new User({name , email , password : hashedpassword, mobile, bloodgrp, emergencyContacts, emergencyEmails});
    await newUser.save();
    
    //create a token using user id
    const hundredYearsInSeconds = 80 * 365 * 24 * 60 * 60;  //80 years in seconds
    const token = jwt.sign({id : newUser._id} , process.env.JWT_SECRET_KEY , {expiresIn : hundredYearsInSeconds});

    res.cookie("token" , token);

    res.status(200).json({message : "user registered successfully." ,
        user:{
            id : newUser._id,
            name : name,
            email : newUser.email,
            mobile: newUser.mobile,
            bloodgrp:newUser.bloodgrp,
            emergencyContacts:newUser.emergencyContacts,
            emergencyEmails:newUser.emergencyEmails
        }
    });

}

/**
 * @name loginUserController
 * @description Controller function to handle user login expect email & password
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req , res){
    const {email , password} = req.body;

     if(!email || !password){
        return res.status(400).json({message : "Email and Password are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message : "Invalid Email or Password."});
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);
    if(!isPasswordValid){
        return res.status(400).json({message : "Invalid password."});
    }
    const hundredYearsInSeconds = 80 * 365 * 24 * 60 * 60;
    const token = jwt.sign({id : user._id} , process.env.JWT_SECRET_KEY , {expiresIn : hundredYearsInSeconds});

    res.cookie("token" , token);

      res.status(200).json({message : "user logged in successfully." ,
        user:{
            id : user._id,
            name : user.name,
            email : user.email,
            mobile: user.mobile,
            bloodgrp:user.bloodgrp,
            emergencyContacts:user.emergencyContacts,
            emergencyEmails:user.emergencyEmails
        }
    });
}

//----> for user logout we used token blacklisting (**use redis for fast response)
/**
 * @name logoutUserController
 * @description Controller function to handle user logout
 * @route GET /api/auth/logout
 * @access Public
 */
async function logoutUserController(req , res){
    const token = req.cookies.token;

    if(token){
        await tokenBlackListModel.create({token});
        
    }
    res.clearCookie("token");

    res.status(200).json({message:"user logged out successfully."});

}

/**
 * @name getUserController
 * @description Controller function to get user details
 * @route GET /api/auth/get-user
 * @access Private
 */
async function getUserController(req, res){
    const user = await User.findById(req.user.id);

    res.status(200).json({
        message:"user details fetched..",
        user:{
            id:user._id,
            name:user.name,
            email: user.email,
            mobile: user.mobile,
            bloodgrp:user.bloodgrp,
            emergencyContacts:user.emergencyContacts,
            emergencyEmails:user.emergencyEmails
        }
    })

}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getUserController
}
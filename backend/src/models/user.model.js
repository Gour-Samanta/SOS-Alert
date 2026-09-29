const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique: [true , "Already Exists"],
        required : true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true,
        
    },
    bloodgrp:{
        type:String,
        required:true,
    },
    // Emergency Contact Details
    emergencyContacts:{
        type:String,
        required:true
    },
      emergencyEmails:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});

const User = mongoose.model("User" , userSchema);
module.exports = User;
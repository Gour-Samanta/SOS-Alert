const express = require("express");
const authroutes = express.Router();
const { registerUserController , loginUserController, logoutUserController, getUserController } = require("../controllers/auth.controllers.js");
const { authUser } = require("../middlewares/auth.middleware.js");

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public api
 */
authroutes.post("/register" ,registerUserController );

/**
 * @route POST api/auth/login
 * @description login an existing user using email & password
 * @access public api
 */

authroutes.post("/login" , loginUserController);

/**
 * @route GET api/auth/logout
 * @description clear token from browser & blacklist the token in mongodb
 * @access public
 */
// authroutes.get("/logout" , logoutUserController);

/**
 * @route GET api/auth/get-user
 * @description get user details.
 * @access private
 */
authroutes.get("/get-user" , authUser, getUserController );

module.exports = authroutes;

const express = require('express');
const sosroutes = express.Router();
const {sosController} = require("../controllers/sos.controllers.js");
const { authUser } = require("../middlewares/auth.middleware.js");


/**
 * @route POST /api/sos
 * @description send sos message to emergency contacts
 * @access Public api
 */
sosroutes.post("/" ,authUser, sosController );
 

module.exports = sosroutes;
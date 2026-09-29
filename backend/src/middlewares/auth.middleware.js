const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenblacklisting.model");

/**
 * @name authUser
 * @description Middleware function to authenticate user using JWT token from cookies
 * @route GET /api/auth/get-user
 */
async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token Not Present." });
  }

  const isTokenBlackListed = await tokenBlackListModel.findOne({ token });
  if(isTokenBlackListed){
    return res.status(401).json({message:" Unauthorised access."});
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid Token." });
  }

}

module.exports = { authUser };

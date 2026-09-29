const User = require("../models/user.model");
const { sendMessage } = require("../utils/sms.sos.js");

async function sosController(req, res) {
  const { id } = req.user;
  const { latitude, longitude } = req.body;
  // Process the SOS request
  try {
    const user = await User.findById(id);
    sendMessage(user, latitude, longitude);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  res.json({ message: "Alert sent to emergency contacts successfully" });
}

module.exports = { sosController };

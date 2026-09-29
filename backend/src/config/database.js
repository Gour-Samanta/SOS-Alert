const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DB connected.");
    })
    .catch(() => {
      console.log("DB Not Connected!");
    });
}

module.exports = connectToDB;

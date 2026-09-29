const mongoose = require("mongoose");

const tokenBlackListingSchema = new mongoose.Schema({
    token :{
        type: String,
        required: [true , "token required."]
    }
}
,{
    timestamps:true
});

const tokenBlackListModel = mongoose.model("BlackListModel" , tokenBlackListingSchema);

module.exports = tokenBlackListModel;
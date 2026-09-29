require('dotenv').config();
const connectToDB = require("./src/config/database.js");
const authroutes = require("./src/routes/auth.routes.js");
const cookieParser = require("cookie-parser");
const sosroutes = require('./src/routes/sos.routes.js');
const cors = require('cors');

const express = require('express');
const app = express();
app.set("trust proxy", 1);

// body parser middleware 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

connectToDB();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }));

  app.get("/api/health", (req, res) => res.status(200).send("OK"));

// auth routes
app.use("/api/auth" , authroutes);

//sos route
app.use("/api/sos", sosroutes);

const PORT = process.env.PORT;
app.listen(PORT , ()=>{
    console.log(`Server listen on port : ${PORT}`)
});
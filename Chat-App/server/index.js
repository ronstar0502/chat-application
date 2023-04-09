const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started on post ${process.env.PORT}`)
})


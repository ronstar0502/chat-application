const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoutes")
const socket = require("socket.io");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on post ${process.env.PORT}`);
});

const io = socket(server,{
  cors:{
    origin:"http://localhost:3000",
    credentials:true,   
  }
})
app.set("socketio", io)

global.onlineUsers = new Map()

io.on("connection",(socket)=>{
  global.chatSocket =socket.on("add-user",(userId)=>{
    onlineUsers.set(userId,socket.id)
  })


  socket.on("send-msg",(data)=>{
    const sendUserSocket =onlineUsers.get(data.to)
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-received",data.message)
    }
  })
})


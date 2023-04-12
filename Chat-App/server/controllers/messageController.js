const messageModel = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const {from,to,message} = req.body
        const data = await messageModel.create({
            message:{text:message},
            users:[from,to],
            sender:from
        })
        console.log(data)
        if(data){
            return res.json({msg:"Message Added Successfully"})
        }
        return res.json({msg:"Failed to add message to the database"})
    } catch (ex) {
        next(ex)
    }
}

module.exports.getAllMessages = async (req, res, next) => {
    try {
        const{from,to}=req.body
        const messages = await messageModel.find({
            users:{
                $all: [from, to],
            },
        }).sort({updateAt:1})
        console.log(messages)
        const projectMessages = messages.map((msg)=>{
            return{
                fromSelf:msg.sender.toString()===from,
                message:msg.message,
            }
        })
        console.log()
        res.json(projectMessages)
    } catch (ex) {
        next(ex)
    }
}

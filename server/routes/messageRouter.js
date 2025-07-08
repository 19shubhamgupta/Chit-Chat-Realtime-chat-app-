const { getUsers, getChatMessage , postMessage } = require("../controllers/messageController")
const { checkUser } = require("../middlewares/checkUser")

const express = require('express')
const messageRouter  = express.Router()

messageRouter.get('/user' , checkUser, getUsers) 
messageRouter.get('/:id' , checkUser, getChatMessage) 
messageRouter.post('/send/:id' , checkUser, postMessage)

module.exports = messageRouter
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middlewares_1 = require("../middlewares/authentication.middlewares");
const chat_controller_1 = require("../controllers/chat.controller");
const chatRouter = (0, express_1.Router)();
chatRouter.post("/send-chat", authentication_middlewares_1.verifyToken, chat_controller_1.sendChat);
chatRouter.put("/block-chat", authentication_middlewares_1.verifyToken, chat_controller_1.blockChat);
chatRouter.delete("/delete/:id", authentication_middlewares_1.verifyToken, chat_controller_1.deleteChat);
chatRouter.get("/get-all-chats", authentication_middlewares_1.verifyToken, chat_controller_1.getAllChats);
exports.default = chatRouter;
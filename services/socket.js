import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from '../models/messageModel.js'; 
import dotenv from "dotenv";
import { UserService } from "./userService.js";

dotenv.config();

export const activeSockets = {}

export const createSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin:[ "http://localhost:3001", "https://magazin-ruby.vercel.app"], //"*", //  "http://localhost:3001"
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization", "Content-Type"],
            credentials: true 
        }
    });

    io.use((socket, next) => {
        const jwtToken = socket.handshake.headers['authorization']; 
        if (jwtToken) {
            const token = jwtToken.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { 
                if (err) {
                    return next(new Error('Unauthorized')); 
                }
                socket.userId = decoded.id; 
                activeSockets[socket.userId] = socket;
                next(); 
            });
        } else {
            next(new Error('Unauthorized'));
        }
    });

    io.on("connection", async (socket) => {
        socket.on("join room", (chatId) => {
            socket.join(chatId);
            console.log(`Клиент присоединился к комнате: ${chatId} по ${socket.id}`);
        });

        const { chatId } = socket.handshake.query; 

        try {
            const messages = await Message.find({ chatId });
            socket.emit("previous messages", messages);
        } catch (error) {
            console.error("Ошибка при получении сообщений:", error);
        }

        socket.on("chat message", async (msg) => {
            console.log("Сообщение:", msg);

            const userId = socket.userId;

            const message = new Message({
                content: msg,
                senderId: userId,
                chatId,
                status: "sent"
            });

            try {
                await message.save();
                console.log("Сообщение сохранено в базе данных");
                const messageObject = {
                    content: msg,
                    senderId: userId,
                    chatId,
                    status: "sent"
                };
                
                const userService = new UserService
                const participants = await userService.getChatParticipants(chatId); 

                participants.forEach(participantId => {
                    const updatedMessageObject = {
                        ...messageObject,
                        chatId,
                    };
                    if (participantId !== userId) {
                        updatedMessageObject.status = 'delivered';
                        io.to(chatId).emit("chat message", updatedMessageObject); 
                    } else {
                        io.to(chatId).emit("chat message", updatedMessageObject); 
                    }
                });
            } catch (error) {
                console.error("Ошибка при сохранении сообщения:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Пользователь отключился:", socket.id);
            delete activeSockets[socket.userId]
        });
    });
};
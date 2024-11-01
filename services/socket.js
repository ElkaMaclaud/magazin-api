import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from '../models/messageModel.js'; 
import dotenv from "dotenv";

dotenv.config();

export const createSocketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "https://magazin-ruby.vercel.app", //"http://localhost:3001"
            methods: ["GET", "POST"],
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
                next(); 
            });
        } else {
            next(new Error('Unauthorized'));
        }
    });

    io.on("connection", async (socket) => {
        console.log("Пользователь подключился:", socket.id);
        try {
            const messages = await Message.find({ senderId: socket.userId });
            socket.emit("previous messages", messages);
        } catch (error) {
            console.error("Ошибка при получении сообщений:", error);
        }

        socket.on("chat message", async (msg) => {
            console.log("Сообщение:", msg);

            const userId = socket.userId;

            const message = new Message({
                content: msg,
                senderId: userId
            });

            try {
                await message.save();
                console.log("Сообщение сохранено в базе данных");
                io.emit("chat message", msg);
            } catch (error) {
                console.error("Ошибка при сохранении сообщения:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Пользователь отключился:", socket.id);
        });
    });
};
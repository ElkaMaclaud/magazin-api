import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import goodRouter from "./routers/goodRoutes.js"
import userRouter from "./routers/userRoutes.js"
import { createSocketServer } from "./services/socket.js"

dotenv.config()
const PORT = process.env.PORT || 3000

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/good", goodRouter)
app.use("/api/user", userRouter)

const start = (async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@cluster0.7hhds1a.mongodb.net/magazin`)
        const server = app.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}`))
        createSocketServer(server)
    } catch(error) {
        console.log(`Что-то пошло не так: ${error}`)
    }
})

start()
import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    timestamp: { type: Date, default: Date.now }
});

export default model('Message', MessageSchema);
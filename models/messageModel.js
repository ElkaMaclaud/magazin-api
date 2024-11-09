import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    content: { type: String, required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export default model('Message', MessageSchema, 'Message');
import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    title: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }
});

ChatSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default model('Chat', ChatSchema, 'Chat');
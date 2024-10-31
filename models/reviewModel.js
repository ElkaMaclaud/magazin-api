import {Schema, model} from "mongoose"

const ReviewModel = new Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true },
    goodId: { type: Types.ObjectId, required: true },
})
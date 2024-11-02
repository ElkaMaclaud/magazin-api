import { Schema, model } from "mongoose"


const IUserGoodSchema = new Schema({
    goodId: { type: String, required: true },
    count: { type: Number, required: true },
    favorite: { type: Boolean, default: false },
    choice: { type: Boolean, default: false }
});


const IInfoPublikSchema = new Schema({
    name: { type: String, required: false },
    city: { type: String, required: false },
    age: { type: Number, required: false }
});


const IInfoPrivateSchema = new Schema({
    phone: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: true },
    gender: { type: String, enum: ["Ж", "М"], required: false },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true }
});


const IDeliverySchema = new Schema({
    address: { type: String, required: false },
    pickUpPoin: { type: String, required: false },
    choice: { type: String, enum: ["address", "pickUpPoin"], required: true }
});


const UserModel = new Schema({
    registered: { type: Boolean, required: true },
    publik: { type: IInfoPublikSchema, required: true },
    privates: { type: IInfoPrivateSchema, required: true },
    favorites: { type: [String], default: [] },
    cart: { type: [IUserGoodSchema], default: [] },
    order: { type: [String], default: [] },
    delivery: { type: IDeliverySchema, required: true },
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }]
}, { timestamps: true });


export default model('User', UserModel, 'User');
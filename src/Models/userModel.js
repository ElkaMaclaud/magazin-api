const mongoose = require('mongoose');


const IUserGoodSchema = new mongoose.Schema({
    goodId: { type: String, required: true },
    count: { type: Number, required: true },
    favorite: { type: Boolean, default: false },
    choice: { type: Boolean, default: false }
});


const IInfoPublikSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    age: { type: Number, required: false }
});


const IInfoPrivateSchema = new mongoose.Schema({
    phone: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: true },
    gender: { type: String, enum: ["Ж", "М"], required: false },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], required: true }
});


const IDeliverySchema = new mongoose.Schema({
    address: { type: String, required: false },
    pickUpPoin: { type: String, required: true },
    choice: { type: String, enum: ["address", "pickUpPoin"], required: true }
});


const UserModelSchema = new mongoose.Schema({
    registered: { type: Boolean, required: true },
    publik: { type: IInfoPublikSchema, required: true },
    privates: { type: IInfoPrivateSchema, required: true },
    favorites: { type: [String], default: [] },
    cart: { type: [IUserGoodSchema], default: [] },
    order: { type: [String], default: [] },
    delivery: { type: IDeliverySchema, required: true }
}, { timestamps: true });


export default UserModel = mongoose.model('User', UserModelSchema);
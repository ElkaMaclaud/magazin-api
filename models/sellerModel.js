import { Schema, model } from "mongoose"

const SellerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    rating: { type: Number, default: 0 },
    reviews: [{
        text: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    products: [{ type: Schema.Types.ObjectId, ref: 'Good' }],
    status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
    socialMediaLinks: { type: Map, of: String }
});

export default model('Seller', SellerSchema);
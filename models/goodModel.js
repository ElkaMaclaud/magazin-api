import { Schema, model } from "mongoose"

const GoodModel = new Schema({
    image: {type: [String], required: true},
    price: {type: Number, required: true},
    oldPrice: {type: Number, required: false},
    brand: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    characteristics: {
        type: Schema.Types.Mixed,
        required: true,
        validate: {
            validator: function(value) {
                if (typeof value === 'string') {
                    return true;
                }
                if (Array.isArray(value)) {
                    return value.every(item => 
                        typeof item === 'object' && 
                        item !== null && 
                        typeof item.name === 'string' && 
                        typeof item.value === 'string'
                    );
                }
                return false; 
            }
        }
    },
    sale: {type: Boolean, required: false},
    discount: {type: Number, required: false}
})

export default model("Good", GoodModel, "Good")
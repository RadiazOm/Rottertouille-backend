import mongoose from 'mongoose';
const { Schema } = mongoose

const discountSchema = new Schema({
    discount: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Discount = mongoose.model('Discount', discountSchema)

export default Discount
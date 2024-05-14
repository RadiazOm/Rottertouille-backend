import mongoose from 'mongoose';
const { Schema } = mongoose

const productSchema = new Schema({
    name: String,
    category: [
        { type: Schema.Types.ObjectId, ref: 'Category'} // foreign key
    ], 
    supermarket: { type: Schema.Types.ObjectId, ref: 'Supermarket'}, // foreign key
    price: Number,
    discount: [
        { type: Schema.Types.ObjectId, ref: 'Discount'} // foreign key
    ], 
    image_url: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', productSchema)

export default Product
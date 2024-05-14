import mongoose from 'mongoose';
const { Schema } = mongoose

const supermarketSchema = new Schema({
    name: String,
    image_url: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Supermarket = mongoose.model('Supermarket', supermarketSchema)

export default Supermarket
import mongoose from 'mongoose';
const { Schema } = mongoose

const instructionSchema = new Schema({
    step: Number,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Instruction = mongoose.model('Instruction', instructionSchema)

export default Instruction
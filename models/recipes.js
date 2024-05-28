import mongoose from 'mongoose';
const { Schema } = mongoose

const recipeSchema = new Schema({
    name: String,
    ingredients: [
        { type: Schema.Types.ObjectId, ref: 'Ingredient' } // foreign key
    ],
    instructions: [
        { type: Schema.Types.ObjectId, ref: 'Instruction' } // foreign key
    ],
    image_url: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Recipe = mongoose.model('Recipe', recipeSchema)

export default Recipe
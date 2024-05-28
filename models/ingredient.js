import mongoose from 'mongoose';
const { Schema } = mongoose

const ingredientSchema = new Schema({
    amount: String,
    product: String,
    // should be reffered to a product key,
    // but as prices changes so should the recipe products,
    // thats why we leave it as a name so that we can query the name in the database
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Ingredient = mongoose.model('Ingredient', ingredientSchema)

export default Ingredient
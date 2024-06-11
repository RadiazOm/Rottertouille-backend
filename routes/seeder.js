import express from "express";
import dummy from '../dummyproducts.json' assert { type: 'json' };
import Pagination from "../pagination/Pagination.js";
import Product from "../models/products.js";
import Recipe from "../models/recipes.js";
import Supermarket from "../models/supermarket.js";
import Instruction from "../models/instructions.js";
import Discount from "../models/discounts.js";
import Category from "../models/categories.js";
import { faker } from "@faker-js/faker";
import Ingredient from "../models/ingredient.js";

const routes = express.Router()

// cors stuff
routes.options('/', function(req, res){
    res.header('Allow', 'GET');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

// cors stuff
routes.options('/search', function(req, res){
    res.header('Allow', 'POST');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

// cors stuff
routes.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next()
})

routes.post('/', async (req, res) => {

    await Product.deleteMany();
    await Recipe.deleteMany();
    await Supermarket.deleteMany();
    await Instruction.deleteMany();
    await Discount.deleteMany();
    await Category.deleteMany();

    const supermarketsNames = ['lidl', 'dirk', 'ah', 'jumbo', 'spar', 'plus']
    const productImages = ['banana.png', 'apple.png', 'steak.png', 'carrot.png', 'ham.png', 'brocolli.png']
    const recipeImages = ['pancakes.png', 'burrito.png', 'pizza.png', 'pasta.png', 'lasagna.png']
    const supermarkets = []
    const categories = []
    const discounts = []
    const instructions = []
    const ingredients = []
    const products = []


    console.log('creating categories')
    for (let i = 0; i < Math.ceil(Math.random() * 10 + 1); i++) {
        const category = await Category.create({
            name: faker.lorem.word({ min: 1, max: 3 })
        })
        categories.push(category)
    }

    console.log('creating discounts')
    for (let i = 0; i < Math.ceil(Math.random() * 30 + 1); i++) {
        const discount = await Discount.create({
            discount: faker.number.float({ min: 0, max: 2, fractionDigits: 3 })
        })
        discounts.push(discount)
    }

    console.log('creating supermarkets')
    for (const supermarket of supermarketsNames) {
        const supermarketModel = await Supermarket.create({
            name: supermarket,
            image_url: supermarket + ".png"
        })
        supermarkets.push(supermarketModel)
    }

    console.log('creating instructions')
    for (let i = 0; i < 8; i++) {
        const instruction = await Instruction.create({
            step: i,
            description: faker.lorem.sentence({ min: 6, max: 15 })
        })
        instructions.push(instruction)
    }

    console.log('creating products')
    for (let i = 0; i < 100; i++) {
        const product = await Product.create({
            name: faker.lorem.word({length: { min: 3, max: 10 }}),
            weight: faker.number.int({ min: 50, max: 1000 }) + 'g',
            category: [categories[Math.floor(Math.random()*categories.length)]._id],
            supermarket: supermarkets[Math.floor(Math.random()*supermarkets.length)]._id,
            price: faker.number.float({ min: 0.1, max: 10, fractionDigits: 2}),
            discount: [discounts[Math.floor(Math.random()*discounts.length)]._id],
            image_url: productImages[Math.floor(Math.random()*productImages.length)]
        })
        products.push(product)
    }

    console.log('creating ingredients')
    for (const product of products) {
        const ingredient = await Ingredient.create({
            amount: faker.number.int({ min: 1, max: 8 }),
            product: product.name
        })
        ingredients.push(ingredient)
    }

    console.log('creating recipes')
    for (let i = 0; i < Math.ceil(Math.random() * 10 + 1); i++) {
        await Recipe.create({
            name: faker.lorem.words({ min: 1, max: 3 }),
            ingredients: [
                ingredients[Math.floor(Math.random()*ingredients.length)]._id,
                ingredients[Math.floor(Math.random()*ingredients.length)]._id,
                ingredients[Math.floor(Math.random()*ingredients.length)]._id
            ],
            instructions: [
                instructions[0]._id,
                instructions[1]._id,
                instructions[2]._id,
                instructions[3]._id,
                instructions[4]._id,
                instructions[5]._id,
                instructions[6]._id,
                instructions[7]._id,
            ],
            image_url: recipeImages[Math.floor(Math.random()*recipeImages.length)]
        })
    }

    res.send({
        message: 'seeding complete'
    })

})

export default routes
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

routes.post('/seed', async (req, res) => {
    const supermarkets = ['lidl', 'dirk', 'ah', 'jumbo', 'aldi', 'spar', 'plus']
    await Product.deleteMany();
    await Recipe.deleteMany();
    await Supermarket.deleteMany();
    await Instruction.deleteMany();
    await Discount.deleteMany();
    await Category.deleteMany();

    await Category.create({
        name: faker.lorem.word({ min: 1, max: 3 })
    })

    await Discount.create({
        discount: faker.number.float({ min: 0, max: 2, fractionDigits: 3 })
    })

    for (const supermarket of supermarkets) {
        await Supermarket.create({
            name: supermarket,
            image_url: supermarket + ".png"
        })
    }






    await Product.create({
        name: faker.lorem.word({length: { min: 3, max: 10 }})
    })

})
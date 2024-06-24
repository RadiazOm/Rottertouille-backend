import express from "express";
import dummy from '../dummyrecipes.json' assert { type: 'json' };
import Pagination from "../pagination/Pagination.js";
import Recipe from "../models/recipes.js";
import Product from "../models/products.js";

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

// Get all the recipes
routes.get('/', async (req, res) => {
    const recipes = await Recipe.find()

    for (let i = 0; i < recipes.length; i++) {
        let ingredients = []
        for (let j = 0; j < recipes[i].ingredients.length; j++) {
            const product = await Product.find({"_id": recipes[i].ingredients[j]})

            console.log(product)

            recipes[i].ingredients.splice(j, 1)
            ingredients.push(product)
        }
        recipes[i].ingredients = ingredients
    }

    const pagination = Pagination.format(recipes, req.query, 'recipes')

    const items = formatJSON(recipes, req.query)

    res.json({
        recipes: items,
        pagination: pagination
    })
})

routes.get('/:id', async (req, res) => {

    const recipe = await Recipe.findOne({'_id': req.params.id})

    const items = formatDetailJSON(recipe)

    res.json({
        recipe: items,
    })
})

// Get all the recipes with a filter
routes.post('/search', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'invalid format: body is empty.'
        })
        return
    }

    const filter = req.body.query
    
    const result = dummy.recipes.filter((item) => {return item.name.includes(filter)})

    const pagination = Pagination.format(result, req.query, 'recipes/search')

    const items = formatJSON(result, req.query)

    res.json({
        recipes: items,
        pagination: pagination
    })
})

function formatJSON(data, query) {
    let JSON = [];
    let start = query.start - 1
    let limit = Math.min(data.length, query.limit)
    if (isNaN(start) || start <= 0) {
        start = 0
    }
    if (isNaN(limit)) {
        limit = Pagination.currentItems(data.length, start, limit)
    }
    for (let i = start; i < Math.min(data.length, start + limit); i++) {
        let newJson = {}
        newJson._id = data[i]._id
        newJson.name = data[i].name
        newJson.ingredients = data[i].ingredients
        newJson.instructions = data[i].instructions
        newJson.image_url = data[i].image_url
        newJson.createdAt = data[i].createdAt
        JSON.push(newJson)
    }

    return JSON
}

function formatDetailJSON(data) {
    let JSON = []
    let newJson = {}
    newJson._id = data._id
    newJson.name = data.name
    newJson.ingredients = data.ingredients
    newJson.instructions = data.instructions
    newJson.image_url = data.image_url
    newJson.createdAt = data.createdAt
    JSON.push(newJson)

    return JSON
}

export default routes
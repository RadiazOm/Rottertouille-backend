import express from "express";
import dummy from '../dummyproducts.json' assert { type: 'json' };
import Pagination from "../pagination/Pagination.js";
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

// Get all the products
routes.get('/', async (req, res) => {
    const products = await Product.find()

    const pagination = Pagination.format(products, req.query, 'products')

    const items = formatJSON(products, req.query)

    res.json({
        products: items,
        pagination: pagination
    })
})

// Get all the products with a filter
routes.post('/search', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'invalid format: body is empty.'
        })
        return
    }

    const filter = req.body.query
    
    const result = dummy.products.filter((item) => {return item.name.includes(filter)})

    const pagination = Pagination.format(result, req.query, 'products/search')

    const items = formatJSON(result, req.query)

    res.json({
        products: items,
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
        newJson.name = data[i].name
        newJson.weight = data[i].weight
        newJson.category = data[i].category
        newJson.supermarket = data[i].supermarket
        newJson.price = data[i].price
        newJson.discount = data[i].discount
        newJson.image_url = data[i].image_url
        newJson.createdAt = data[i].createdAt
        JSON.push(newJson)
    }

    return JSON
}

export default routes
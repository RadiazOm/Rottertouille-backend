import express from "express";
import dummy from '../dummyproducts.json' assert { type: 'json' };
import Pagination from "../pagination/Pagination.js";
import Product from "../models/products.js";
import Supermarket from "../models/supermarket.js";

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

    for (let i = 0; i < products.length; i++) {
        const supermarket = await Supermarket.findOne({'_id': products[i].supermarket})

        console.log(supermarket)

        products[i].supermarket = supermarket
    }

    const pagination = Pagination.format(products, req.query, 'products')

    const items = formatJSON(products, req.query)

    res.json({
        products: items,
        pagination: pagination
    })
})

routes.get('/:id', async (req, res) => {

    const product = await Product.findOne({'_id': req.params.id})

    console.log(product)

    const items = formatDetailJSON(product)

    res.json({
        product: items,
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

routes.post('/insert', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'invalid format: body is empty.'
        })
        return
    }

    try {
        const product = await Product.create({
            name: req.body.name,
            weight: req.body.weight || null,
            category: '665ee6969d5b940bead288d2',
            supermarket: req.body.supermarket || null,
            price: req.body.price,
            discount: req.body.discount || null,
            image_url: req.body.image_url
        })

        res.json({
            product: product
        })
    } catch (error) {
        console.log('wuh oh something went very wrong: ' + error)
        res.status(500).json({
            message: 'uh oh something went wrong'
        })
    }
})

routes.delete('/reset', async (req, res) => {
    const reset = await Product.deleteMany()

    console.log(reset)

    res.send({
        message: 'deleted database'
    })
})

function formatJSON(data, query) {
    let JSON = [];
    let start = query.start - 1
    let limit = Math.min(data.length, query.limit ?? 20)
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

function formatDetailJSON(data) {
    let JSON = []
    let newJson = {}
    newJson._id = data._id
    newJson.name = data.name
    newJson.weight = data.weight
    newJson.category = data.category
    newJson.supermarket = data.supermarket
    newJson.price = data.price
    newJson.discount = data.discount
    newJson.image_url = data.image_url
    newJson.createdAt = data.createdAt
    JSON.push(newJson)

    return JSON
}

export default routes
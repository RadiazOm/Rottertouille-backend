import express from "express";
import dummy from '../dummysupermarkets.json' assert { type: 'json' };
import Pagination from "../pagination/Pagination.js";
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

// Get all the supermarkets
routes.get('/', async (req, res) => {
    const supermarkets = await Supermarket.find()

    const pagination = Pagination.format(supermarkets, req.query, 'supermarkets')

    const items = formatJSON(supermarkets, req.query)

    res.json({
        supermarkets: items,
        pagination: pagination
    })
})

routes.get('/:id', async (req, res) => {

    const supermarket = await Supermarket.findOne({'_id': req.params.id})

    const items = formatDetailJSON(supermarket)

    res.json({
        supermarket: items,
    })
})

routes.get('products/:id', (req, res) => {
    //: TODO: pascal mag dit lekker maken

    // product.find met supermarket id van parameter

    // pagination

    // format

    // send

    // error handling
})

// Get all the products with a filter
// TODO: CONNECT WITH DATABASE
routes.post('/search', (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'invalid format: body is empty.'
        })
        return
    }

    const filter = req.body.query
    
    const result = dummy.supermarkets.filter((item) => {return item.name.includes(filter)})

    const pagination = Pagination.format(result, req.query, 'supermarkets/search')

    const items = formatJSON(result, req.query)

    res.json({
        supermarkets: items,
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
    newJson.image_url = data.image_url
    newJson.createdAt = data.createdAt
    JSON.push(newJson)

    return JSON
}

export default routes
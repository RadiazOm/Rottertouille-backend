import express from "express";
import Discount from "../models/discounts.js";

const routes = express.Router()

// cors stuff
routes.options('/', function (req, res) {
    res.header('Allow', 'GET');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

// cors stuff
routes.options('/search', function (req, res) {
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

routes.post('/insert', async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: 'invalid format: body is empty.'
        })
        return
    }

    try {
        const discount = await Discount.create({
            discount: req.body.discount,
        })

        res.json({
            discount: discount
        })
    } catch (error) {
        console.log('wuh oh something went very wrong: ' + error)
        res.status(500).json({
            message: 'uh oh something went wrong'
        })
    }
})

export default routes
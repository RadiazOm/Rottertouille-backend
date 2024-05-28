import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import productsRoutes from './routes/productsRoutes.js'
import supermarketsRoutes from './routes/supermarketRoutes.js'
import recipesRoutes from './routes/recipesRoutes.js'
import imageRoute from './routes/image.js'
import seedRoute from './routes/seeder.js'

const app = express();

// connect to database
mongoose.connect(process.env.DB_CONNECTION + process.env.DB_NAME);

// body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/seed', seedRoute)
app.use('/products', productsRoutes)
app.use('/supermarkets', supermarketsRoutes)
app.use('/recipes', recipesRoutes)
app.use('/image', imageRoute)

// error handling
app.use(function errorHandler(err, req, res, next) { res.send('error happened ' + err.message); console.log('ERROR: ' + err.message) });

// port listener
app.listen(process.env.EXPRESS_PORT, () => {
    console.log('server started at ' + process.env.EXPRESS_URI + ':' + process.env.EXPRESS_PORT)
});
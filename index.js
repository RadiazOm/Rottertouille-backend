import express from 'express';
import 'dotenv/config';
import productsRoutes from './routes/productsRoutes.js'
import supermarketsRoutes from './routes/supermarketRoutes.js'
import recipesRoutes from './routes/recipesRoutes.js'



const app = express();

// body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes
app.use('/products', productsRoutes)
app.use('/supermarkets', supermarketsRoutes)
app.use('/recipes', recipesRoutes)


// error handling
app.use(function errorHandler(err, req, res, next) { res.send('error happened ' + err.message); console.log('ERROR: ' + err.message) });


app.listen(process.env.EXPRESS_PORT, () => {
    console.log('server started at ' + process.env.EXPRESS_URI + ':' + process.env.EXPRESS_PORT)
});
import express from "express";
import path from "path"
import { fileURLToPath } from 'url';
import fs from "fs"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
routes.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next()
})

routes.get('/:url', async (req, res) => {
    const url = req.params.url
    
    let filePath = path.join(path.join(__dirname, '../'), `/assets/${url}`)
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.status(404).json({ message: "Image could not be found"})
    }
});

export default routes
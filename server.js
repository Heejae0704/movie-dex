require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan());

function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (apiToken !== authToken) {
        res.status(401).json({error: 'Unauthorized request'})
    }
    next();
}

app.use(validateBearerToken)

function handleGetMovie(req, res) {
    res.send('Hello, movie!')
}

app.get('/movie', handleGetMovie)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
})


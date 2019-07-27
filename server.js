require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const MOVIE = require('./movies-data-small.json')

const app = express();

app.use(cors());
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || apiToken !== authToken.split(' ')[1]) {
        res.status(401).json({error: 'Unauthorized request'})
    }
    next();
}

app.use(validateBearerToken)

function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query
    let result = MOVIE

    if (Number(avg_vote) === 'NaN') {
        res.status(400).send('You need to enter a number to avg_vote query')
    }

    if (genre) {
        result = result.filter(item => {
            return item.genre.toLowerCase().includes(genre.toLowerCase())
        })
    }

    if (country) {
        result = result.filter(item => {
            return item.country.toLowerCase().includes(country.toLowerCase())
        })
    }

    if (avg_vote) {
        result = result.filter(item => {
            return item.avg_vote >= Number(avg_vote)
        })
    }
    res.status(200).json(result);
}

app.get('/movie', handleGetMovie)

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: {message: 'server error'}}
    } else {
        response = { error }
    }
    res.response(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`)
})


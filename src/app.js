const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Serdar Usta'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        img: '/img/robot.png',
        name: 'Serdar Usta'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'This is some helpful text',
        name: 'Serdar Usta'
    })
})

app.get('/weather', ({ query }, res) => {
    if (!query.address) {
        res.send({
            error: 'You must provide an address'
        })
    } else {
        geocode(query.address, (error, { latitude, longitude, location } = {}) => {
            if (error) {
                res.send({ error: error })
            }

            forecast(latitude, longitude, (error, { text } = {}) => {
                if (error) {
                    res.send({ error: error })
                }

                res.send({
                    address: query.address,
                    forecast: text,
                    location: location
                })
            })
        })
    }
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'You must provide a search term'
        })
    } else {
        res.send({
            products: []
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Serdar Usta'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error',
        errorMessage: 'Page not found',
        name: 'Serdar Usta'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
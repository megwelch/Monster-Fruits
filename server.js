
/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module
// const { on } = require("events")

/////////////////////////////////////////////
// Import Our Models
/////////////////////////////////////////////
const Fruit = require('./models/fruit')

/////////////////////////////////////////////
// Databse Connection
/////////////////////////////////////////////
// this is where we will set up our inputs for our database connection function

const DATABASE_URL = process.env.DATABASE_URL
// here is out DB config object
const CONFIG = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
// establish our connection
mongoose.connect(DATABASE_URL, CONFIG)

// tell mongoose what to do with cerain events
// opens, disconnects, and errors
mongoose.connection
    .on('open', () => console.log('connected to mongoose'))
    .on('close', () => console.log('disconnected from mongoose'))
    .on('error', (error) => console.log('an error occurred \n', error))

/////////////////////////////////////////////
// Create Our Express Application Object
/////////////////////////////////////////////
 const app = express()

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request to process through our middleware before mongoose does anything with it

app.use(morgan('tiny')) 
// ^^^ this is for request logging, the 'tiny' argument declares what size of morgan log to use
app.use(express.urlencoded({ extended:true }))
// ^^^ request bodies(useful for POST and PUT requests)
app.use(express.static('public'))
// ^^^ serve files from the public folder statically
app.use(express.json())
// ^^^ parses incoming request payloads with JSON

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Your server is running, better go out and catch it")
    // you can also send html as a string from res.send
    // res.send("<small style='color: red'>Your server is running, better go out and catch it</small>")
})

// Here, we're going to set up a seed route
// this will seed our database for us, so we have some starting resources
// there are two ways we're going to talk about seeding a db
// routes -> they work, but they're not best practices
// seed scripts -> they work, and they are best practices
app.get("/fruits/seed", (req, res) => {
    // array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
    ]

    // Delete every fruit in the db
    Fruit.deleteMany({})
        .then(() => {
            // seed with the starter fruits array
            Fruit.create(startFruits)
                .then(data => {
                    res.json(data)
                })
        })
})

// GET request
// index route -> shows all instances of a document in the db
app.get("/fruits", (req, res) => {
    // in our index route, we want to use mongoose model methods to get our data
    Fruit.find({})
        .then(fruits => {
            // this is fine for initial testing
            // res.send(fruits)
            // this the preferred method for APIs
            res.json({ fruits: fruits })
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new fruits
app.post('/fruits', (req, res) => {
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // we'll use the mongoose method 'create' to make a new fruit
    Fruit.create(req.body)
        .then(fruit => {
            // send the user a '201 created' response, along with the new fruit
            res.status(201).json({ fruit: fruit.toObject() })
        })
        .catch(error => console.log(error))
})

// PUT request
// update route -> updates a specfic fruit
app.put('/fruits/:id', (req, res) => {
    // console.log(req.params)
    // res.send(`nothing yet, but we're getting there`)
    const id = req.params.id
    // for now, we'll use a simple mongoose model, eventually we'll update this(and all) routes and we'll use a different method
    // we're using findByIdAndUpdate, which needs three arguments
    // it needs an id, it needs the req.body, and whether the info is new
    Fruit.findByIdAndUpdate(id, req.body, {new: true})
        .then(fruit => {
            console.log('the fruit from update', fruit)
            // update success is called '204 - no content'
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE request
// destroy route -> finds and deletes a single resource (fruit)
app.delete("/fruits/:id", (req, res) => {
    // grab id from the request
    const id = req.params.id
    // find and delete the fruit
    Fruit.findByIdAndRemove(id)
        .then(fruit => {
            res.sendStatus(204)
        })
        .catch(err => res.json(err))
    // send a 204 if successful
    // send the error if not
})

// SHOW request
// read route -> finds and displays a single resource
app.get("/fruits/:id", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    const id = req.params.id
    Fruit.findById(id)
        .then(fruit => {
            // this is fine for initial testing
            // res.send(fruits)
            // this the preferred method for APIs
            res.json({ fruit: fruit })
        })
        .catch(err => console.log(err))
})

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`now listening to the sweet sounds of port: ${PORT}`))

// END
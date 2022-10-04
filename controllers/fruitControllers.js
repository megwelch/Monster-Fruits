////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Fruit = require("../models/fruit")

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////

// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
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
router.post('/', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete("/:id", (req, res) => {
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
router.get("/:id", (req, res) => {
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

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
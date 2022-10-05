////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const session = require("express-session")
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
    // this is going to add ownership via a foreign key reference to our fruits
    // basically, all we have to do is append out request body with the 'owner field and set the value to the logged user's id
    req.body.owner = req.session.userId
    // we'll use the mongoose method 'create' to make a new fruit
    Fruit.create(req.body)
        .then(fruit => {
            // send the user a '201 created' response, along with the new fruit
            res.status(201).json({ fruit: fruit.toObject() })
        })
        .catch(error => console.log(error))
})

// GET request
// only fruits owned by logged in user
// we're going to build another route that is owner specific to list all of the fruits owned by a specific (logged-in) user
router.get('/mine', (req, res) => {
    // find the fruits by ownership
    Fruit.find({owner: req.session.userId})
    // then display the fruits
        .then(fruits => {
            res.status(200).json({fruits: fruits})
        })
    // or throw an error if there is one
})

// PUT request
// update route -> updates a specfic fruit
router.put('/:id', (req, res) => {
    // console.log(req.params)
    // res.send(`nothing yet, but we're getting there`)
    const id = req.params.id
    Fruit.findById(id)
    // for now, we'll use a simple mongoose model, eventually we'll update this(and all) routes and we'll use a different method
    // we're using findByIdAndUpdate, which needs three arguments
    // it needs an id, it needs the req.body, and whether the info is new
    // Fruit.findByIdAndUpdate(id, req.body, {new: true})
        .then(fruit => {
            if(fruit.owner == req.session.userId){
                res.sendStatus(204)
                return fruit.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
            // console.log('the fruit from update', fruit)
            // update success is called '204 - no content'
        })
        // .then(fruit => {
        //     console.log('the update fruit', fruit)
        //     res.sendStatus(204)
        // })
        .catch(err => res.json(err))
})

// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the fruit
    // Fruit.findByIdAndRemove(id)
    Fruit.findById(id)
        .then(fruit => {
            // we check for ownership against the logged in user's id
            if (fruit.owner == req.session.userId) {
                // if successful, send a status and delete the fruit
                res.sendStatus(204)
                return fruit.deleteOne()
            } else {
                // if they are not the user, send the unauthorized status
                res.sendStatus(401)
            }
        })
        // send the error if not
        .catch(err => res.json(err))
})

// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Fruit.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(fruit => {
            res.json({ fruit: fruit })
        })
        .catch(err => console.log(err))
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
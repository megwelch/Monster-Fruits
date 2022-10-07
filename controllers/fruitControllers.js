////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Fruit = require("../models/fruit")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Fruit.find({})
        .populate("comments.author", "username")
        .then(fruits => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // console.log(fruits)
            // this is fine for initial testing
            // res.send(fruits)
            // this the preferred method for APIs
            // res.json({ fruits: fruits })
            // here, we're going to render a page, but we can also send data that we got from the database to that liquid page for rendering
            res.render('fruits/index', { fruits, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET for new fruit
// renders the form to create a fruit
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('fruits/new', { username, loggedIn, userId })
})
// POST request
// create route -> gives the ability to create new fruits
router.post("/", (req, res) => {
    // bc our checkboxes dont send true or false(which they totally should but whatev)
    // we need to do some js magic to change the value
    // first side of the equals sign says "set this key to be the value"
    // the value comes from the ternary operator, checking the req.body field
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // this is going to add ownership, via a foreign key reference, to our fruits
    // basically, all we have to do, is append our request body, with the `owner` field, and set the value to the logged in user's id
    req.body.owner = req.session.userId
    console.log('the fruit from the form', req.body)
    // we'll use the mongoose model method `create` to make a new fruit
    Fruit.create(req.body)
        .then(fruit => {
            // send the user a '201 created' response, along with the new fruit
            // res.status(201).json({ fruit: fruit.toObject() })
            res.redirect('/fruits')
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET request
// only fruits owned by logged in user
// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the fruits, by ownership
    Fruit.find({ owner: req.session.userId })
    // then display the fruits
        .then(fruits => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId

            // res.status(200).json({ fruits: fruits })
            res.render('fruits/index', { fruits, username, loggedIn, userId })
        })
    // or throw an error if there is one
        .catch(err => res.redirect(`/error?error=${err}`))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    const fruitId = req.params.id
    Fruit.findById(fruitId)
        // render the edit form if there is a fruit
        // redirect if there isn't
        .then(fruit => {
            res.render('fruits/edit', {fruit, username, loggedIn, userId})
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
    // res.send('edit page')
})

// PUT request
// update route -> updates a specific fruit
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    Fruit.findById(id)
        .then(fruit => {
            if (fruit.owner == req.session.userId) {
                // res.sendStatus(204)
                // return fruit.updateOne(req.body)
                // must return the results of this query
                return fruit.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .then(() => {
            res.redirect(`/fruits/${id}`)
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})


// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
// here lies our old API delete route
// router.delete("/:id", (req, res) => {
//     // grab the id from the request
//     const id = req.params.id
//     // find and delete the fruit
//     // Fruit.findByIdAndRemove(id)
//     Fruit.findById(id)
//         .then(fruit => {
//             // we check for ownership against the logged in user's id
//             if (fruit.owner == req.session.userId) {
//                 // if successful, send a status and delete the fruit
//                 res.sendStatus(204)
//                 return fruit.deleteOne()
//             } else {
//                 // if they are not the user, send the unauthorized status
//                 res.sendStatus(401)
//             }
//         })
//         // send the error if not
//         .catch(err => res.json(err))
// })
router.delete('/:id', (req, res) => {
    // get the fruit id
    const fruitId = req.params.id

    // delete and REDIRECT
    Fruit.findByIdAndRemove(fruitId)
        .then(fruit => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/fruits')
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
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
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.json({ fruit: fruit })
            res.render('fruits/show', { fruit, username, loggedIn, userId })
        })
        .catch(err => res.redirect(`/error?error=${err}`))
})


//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router
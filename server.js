/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express

// const mongoose = require("mongoose") // import mongoose
    //^^^ we don't need this dependency anymore because it lives in connection.js
const path = require("path") // import path module
const FruitRouter = require('./controllers/fruitControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const middleware = require('./utils/middleware')
const e = require("express")

/////////////////////////////////////////////
// Create Our Express Application Object
/////////////////////////////////////////////
 const app = require('liquid-express-views')(express())

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// our middleware is now being passed through a function in the utils directory
// the middleware function takes one argument, an app, and processes the middleware on that app
middleware(app)

/////////////////////////////////////////////
// Home Route
/////////////////////////////////////////////

app.get("/", (req, res) => {
    // res.send("Your server is running, better go out and catch it")
    // you can also send html as a string from res.send
    // res.send("<small style='color: red'>Your server is running, better go out and catch it</small>")
    if (req.session.loggedIn){
        res.redirect('/fruits')
    } else {
        res.render('index.liquid')
    }
    res.render('index.liquid')
})

/////////////////////////////////////////////
// Register our Routes
/////////////////////////////////////////////
// here is where we register our routes, this is how server.js knows to tsend the appropraite request to the appropriate route and send the correct response
// app.use, when we register a route needs 2 arguements
    // the first is the base url endpoint, the second is the file to use
app.use('/fruits', FruitRouter)
app.use('/comments', CommentRouter)
app.use('/users', UserRouter)

// this renders an error page, gets the error from a url request query
app.get('/error', (req, res) => {
    // get session variables
    const {username, loggedIn, userId} = req.session
    const error = req.query.error || 'This page does not exist'

    res.render('error.liquid', {error, username, loggedIn, userId})
})

// this is a catchall route that will redirect to the error page for anything that doesn't satisfy a controller
// * means anything... this has to be at the bottom (if at the top would be satisfied every time)
app.all('*', (req, res) => {
    res.redirect('/error')
})

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`now listening to the sweet sounds of port: ${PORT}`))

// END
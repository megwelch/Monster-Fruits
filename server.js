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
const middleware = require('./utils/middleware')

/////////////////////////////////////////////
// Create Our Express Application Object
/////////////////////////////////////////////
 const app = express()

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
    res.send("Your server is running, better go out and catch it")
    // you can also send html as a string from res.send
    // res.send("<small style='color: red'>Your server is running, better go out and catch it</small>")
})

/////////////////////////////////////////////
// Register our Routes
/////////////////////////////////////////////
// here is where we register our routes, this is how server.js knows to tsend the appropraite request to the appropriate route and send the correct response
// app.use, when we register a route needs 2 arguements
    // the first is the base url endpoint, the second is the file to use
app.use('/fruits', FruitRouter)
app.use('/users', UserRouter)

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`now listening to the sweet sounds of port: ${PORT}`))

// END

/////////////////////////////////////////////
// Import Our Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan
const mongoose = require("mongoose") // import mongoose
const path = require("path") // import path module
const { on } = require("events")

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
// ^^^ this is for request logging, the'tiny argument declard what size of morgan log to use
app.use(express.urlencoded({ extended:true }))
// ^^^ request bodies(useful for POST and PUT requests)
app.use(express.static('public'))
// ^^^ serve files from the public folder statically
app.use(express.json())
// ^^^ parses incoming request payloads with JSON

/////////////////////////////////////////////
// Routes
/////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('your server is running, better go out and catch it')
})

// app.get('/donut', (req, res) => {
//     res.send('welcome to the donut page')
// })

/////////////////////////////////////////////
// Server Listener
/////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`not listening to the sweet sounds of port: ${PORT}`))

// END
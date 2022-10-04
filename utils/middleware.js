/////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const express = require("express") // import express
const morgan = require("morgan") // import morgan

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
const middleware = (app) => {
    app.use(morgan('tiny')) 
    // ^^^ this is for request logging, the 'tiny' argument declares what size of morgan log to use
    app.use(express.urlencoded({ extended:true }))
    // ^^^ request bodies(useful for POST and PUT requests)
    app.use(express.static('public'))
    // ^^^ serve files from the public folder statically
    app.use(express.json())
    // ^^^ parses incoming request payloads with JSON
}

/////////////////////////////////////////////
// Middleware Function
/////////////////////////////////////////////
module.exports = middleware
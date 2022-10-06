/////////////////////////////////////////////
// Dependencies
/////////////////////////////////////////////
require('dotenv').config() // Load ENV Variables
const morgan = require('morgan') // import morgan
const express = require('express') // import express
const methodOverride = require('method-override')
const session = require('express-session')
const MongoStore = require('connect-mongo')

/////////////////////////////////////////////
// Middleware
/////////////////////////////////////////////
// middleware runs before all the routes, every request to process through our middleware before mongoose does anything with it
const middleware = (app) => {
    // method override is middleware that lets us use forms to their full potential
    // by default, a form on a webpage can only send a get or a post request
    // method override allows us to send put, path, delete, or other requests from a form by defining it with '_method'
    app.use(methodOverride('_method'))
    app.use(morgan('tiny')) 
    // ^^^ this is for request logging, the 'tiny' argument declares what size of morgan log to use
    app.use(express.urlencoded({ extended:true }))
    // ^^^ request bodies(useful for POST and PUT requests)
    app.use(express.static('public'))
    // ^^^ serve files from the public folder statically

    app.use(express.json())
    // ^^^ parses incoming request payloads with JSON
    // we need to set up a session function and pass that function an object as the argument, that argument object will tell express session how to build our session
    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL
            }),
            saveOnInitialized: true,
            resave: false
        })
    )
}

/////////////////////////////////////////////
// Middleware Function
/////////////////////////////////////////////
module.exports = middleware
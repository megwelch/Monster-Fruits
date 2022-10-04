/////////////////////////////////////////////
// Import Dependencies
/////////////////////////////////////////////
require("dotenv").config() // Load ENV Variables
const mongoose = require("mongoose") // import mongoose

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
// Export Our Connection
/////////////////////////////////////////////
module.exports = mongoose
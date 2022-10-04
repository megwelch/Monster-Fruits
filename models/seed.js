///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Fruit = require('./fruit')

// Here, we're going to set up a seed script
// this will seed our database for us, so we have some starting resources
// this script will be run, with the command in the terminal 'npm run seed'
// router.get("/seed", (req, res) => {
//     // array of starter fruits

//     // Delete every fruit in the db
//     Fruit.deleteMany({})
//         .then(() => {
//             // seed with the starter fruits array
//             Fruit.create(startFruits)
//                 .then(data => {
//                     res.json(data)
//                 })
//         })
// })

///////////////////////////////////////
// Seed Script
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter fruits
    const startFruits = [
        { name: "Orange", color: "orange", readyToEat: false },
        { name: "Grape", color: "purple", readyToEat: false },
        { name: "Banana", color: "orange", readyToEat: false },
        { name: "Strawberry", color: "red", readyToEat: false },
        { name: "Coconut", color: "brown", readyToEat: false },
    ]

    // delete all the existing fruits
    Fruit.deleteMany({})
        .then(deletedFruits => {
            console.log('this is what .deleteMany returns', deletedFruits)

            // create a bunch of new fruits from startFruits
            Fruit.create(startFruits)
                .then(data => {
                    console.log('here are the newly created fruits', data)
                    db.close()
                })
                .catch(err => {
                    console.log(err)
                    // always close connection to the db
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            db.close()
        })
    // replace all of them with the start fruits
})
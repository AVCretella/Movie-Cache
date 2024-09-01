import express from 'express';
import { MongoClient } from 'mongodb'
import { routeNames, validateRequestBody } from './validation.js';

let ratings = [
    {
        movieId: "1",
        rating: 4.5,
        numRatings: 20,
        reviews: []
    },
    {
        movieId: "2",
        rating: 4.9,
        numRatings: 12,
        reviews: []
    },
    {
        movieId: "3",
        rating: 3.2,
        numRatings: 54,
        reviews: []
    },
]

let perRatings = [
    {
        movieId: "1",
        userId: "7",
        rating: 4.5,
        reviews: ""
    },
    {
        movieId: "2",
        rating: 4.9,
        numRatings: 12,
        reviews: []
    },
    {
        movieId: "3",
        rating: 3.2,
        numRatings: 54,
        reviews: []
    },
]

// connDB() => {

// }

let db;
const app = express();
app.use(express.json()) //whenever receiving json, express will handle

async function connDB(cb) {
    const client = new MongoClient('mongodb://127.0.0.1:27017')
    await client.connect()
    db = client.db('movie-cache-db')
    cb()
}

app.get('/api/:movieId/ratings', async (req,res) => {
    const {movieId} = req.params

    const client = new MongoClient('mongodb://127.0.0.1:27017')
    await client.connect()
    const db = client.db('movie-cache-db')

    const rating = await db.collection('tempRatings').findOne({movieId})

    if (rating) {
        res.json(rating)
    } else {
        res.sendStatus(404)
    }
}) 
// app.get('/hello', (req, res) => {
//     res.send(("hello you did it"))
// })

// app.post('/basicReq', (req, res) => {
//     console.log(req.body)
//     let resMessage = "we  got your req " + req.body.name
//     res.send(resMessage)
// })

// //same as above, except no object was sent, we just parsed the url that was sent
// //can add as many  :'s as you want, each will be a param
// app.get('/basiqReq/:name', (req,res) => {
//     // const name = req.params.name;
//     const {name} = req.params
//     res.send(`hello ${name} from url`)
// })
// async function conn() {
//     const client = new MongoClient('mongodb://127.0.0.1:27017')
//     await client.connect()
//     const db = client.db('movie-cache-db')
//     return db;
// }

app.get('/api/ratings/getAll', async (req, res) => {

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect()
    // const db = client.db('movie-cache-db')

    let ratings = await db.collection('tempRatings').find({}).toArray()
    res.json(ratings)

})

app.post('/api/movies/resetTemp1', async (req,res) => {
    const client = new MongoClient('mongodb://127.0.0.1:27017')
    await client.connect()
    const db = client.db('movie-cache-db')

    db.collection('tempRatings').replaceOne({movieId: "1"}, {
            movieId: "1",
            userId: "7",
            rating: 4.5,
            review: ""
        })

        const rating = await db.collection('tempRatings').findOne({movieId: "1"})

        if (rating) {
            res.json(rating)
        } else {
            res.sendStatus(404)
        }
})

/*  
    Will upsert a new user review for a movie.
    The request object must have a valid movieId, userId, and rating. review is an optional field
*/
app.post('/api/movies/newRating', async (req,res) => {
    try {
        console.log(req.body)
        const {movieId, userId, newRating, newReview} = await validateRequestBody(routeNames.newRating, req.body)

        // await connDB()

        let updateFields = {
            movieId: movieId,
            userId: userId,
            rating: newRating
        }
        if (newReview != "") { updateFields["review"] = newReview }

        const result = await db.collection('tempRatings').updateOne(
            { movieId: movieId },
            { $set: updateFields },
            {upsert: true}
        )
        console.log(result)

        const rating = await db.collection('tempRatings').findOne({movieId: movieId})
        console.log(rating)
        res.json(rating)

    } catch (err) {
        console.log(err)
        res.sendStatus(404)
    }
})

app.put('/api/movies/:id/:newRating/rate', async (req,res) => {
    const { id, newRating } = req.params
    // const ratingToUpdate = ratings.find(r => r.movieId === id)

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect()
    // const db = client.db('movie-cache-db')

    if (newRating > 5) { newRating = 5 }
    else if(newRating < 0) { newRating = 0 }

    try {
        await db.collection('tempRatings').updateOne(
            { movieId: id },
            [
                {
                    $set: {
                        rating: { //rating will become (rating * numRatings) / numRatings++
                            $divide: [
                                { 
                                    $add: [ 
                                        { $multiply: ["$rating", "$numRatings"] }, 
                                        { $toDouble: newRating } 
                                    ]
                                },
                                { $add: ["$numRatings", 1] }
                            ]
                        },
                        numRatings: { $add: ["$numRatings", 1] }
                    }
                }
            ]
        )

        const rating = await db.collection('tempRatings').findOne({movieId: id})
        res.json(rating)

    } catch (err) {
        console.log(err)
        res.sendStatus(404)
    }

    // if(ratingToUpdate) {
    //     const numRatings = ratingToUpdate.numRatings
    //     let pastR = ratingToUpdate.rating * numRatings
    //     let newR = pastR + parseFloat(newRating)
    //     let newNumRatings = numRatings + 1
    //     console.log({newR}, "divided by")
    //     console.log({newNumRatings})

    //     ratingToUpdate.rating = newR / newNumRatings
    //     console.log("this what we got: ", ratingToUpdate.rating)
    //     ratingToUpdate.numRatings += 1
    //     res.send(`The new rating is: ${ratingToUpdate.rating} and has ${ratingToUpdate.numRatings} ratings!!`)
    // } else {
    //     res.send("articles doesnt exist")
    // }
})

//TODO when adding a review, require the users id, the movieid, the review, and the rating
app.post('/api/movies/review', (req, res) => {
    const {userId, movieId, review} = req.body;
    const rating = ratings.find(r => r.movieId === movieId)

    if(rating) {
        rating.reviews.push({userId, review})
        console.log(rating)
        res.send(`your new rating: ${rating.reviews}`)
    } else {
        res.send("Invalid review format")
    }
})

app.get('/api/profiles/getTempProfile/:id', async (req, res) => {
    const { id } = req.params
    console.log("the id we are saerching for: ", id)
    let profile = await db.collection('tempProfiles').findOne({userId: id})
    res.json(profile)

})

app.get('/api/profiles/getAll', async (req, res) => {
    let allProfiles = await db.collection('tempProfiles').find({}).toArray()
    res.json(allProfiles)

})

app.post('/api/profiles/addTempProfiles', async (req, res) => {
    const  profileData  = req.body
    const options = { ordered: true };
    console.log({profileData})
    // console.log("the id we are saerching for: ", id)
    let profiles = await db.collection('tempProfiles').insertMany(profileData, options)
    res.json(profiles)

})

connDB(() => {
    console.log("conned to db")
    app.listen(8000, () => {
        console.log('server lsitening on port 8000')
    })
})
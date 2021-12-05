const {
    MongoClient
} = require('mongodb');

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

const cors = require('cors');
const {
    query
} = require('express');

require('dotenv').config()

const client = new MongoClient(process.env.URL);

// The database to use
const dbName = "session7_project";

const port = process.env.PORT

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(cors())

app.get('/challenges', async (req, res) => {
    try {
        await client.connect()
        const colli = client.db(dbName).collection('challenges')
        const clngs = await colli.find({}).toArray()

        res.status(200).json(clngs)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'something went wrong',
            value: error
        })
    } finally {
        await client.close()
    }
})

app.post('/challenges', async (req, res) => {
    try {

        const db = client.db(dbName);
        const col = db.collection("challenges");
        console.log("Connected correctly to server");

        await client.connect();

        // Construct a document                                                                                                                                                              
        let challengeDoc = {
            name: req.body.name,
            points: req.body.points,
            course: req.body.course,
            session: req.body.session
        }

        res.status(200).send('succesfully uploaded')

        // Insert a single document, wait for promise so we can read it back
        const p = await col.insertOne(challengeDoc);

        // Find one document
        const myDoc = await col.findOne();

        // Print to the console
        console.log(myDoc);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
})

app.get('/challenges/:id', async (req, res) => {
    try {
        await client.connect()
        const colli = client.db(dbName).collection('challenges')

        const query = {
            _id: req.params.id
        }

        const clngs = await colli.findOne(query)
        res.status(200).json(clngs)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: 'something went wrong',
            value: error
        })
    } finally {
        await client.close()
    }

})

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`)
})
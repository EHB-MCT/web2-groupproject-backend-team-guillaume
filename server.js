import {
    MongoClient
} from 'mongodb';

import express from 'express';
const app = express()

import bodyParser from 'body-parser';

import fs from 'fs/promises'
import {
    receiveMessageOnPort
} from 'worker_threads';

// Replace the following with your Atlas connection string                                                                                                                                        

const url = "mongodb+srv://project:project@cluster0.t4a9d.mongodb.net/session7_project?retryWrites=true&w=majority";

const client = new MongoClient(url);

// The database to use
const dbName = "session7_project";

const port = 3000

app.get('/challenges', async (req, res) => {
    try {
        await client.connect()
        const colli = client.db(dbName).collection('challenges')
        const clngs = await colli.find({}).toArray()

        res.status(200).send(clngs)
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

app.use(bodyParser.json())

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
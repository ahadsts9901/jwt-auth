import express from 'express';
import { client } from '../../mongodb.mjs'
import { ObjectId } from 'mongodb';

const db = client.db("cruddb")
const col = db.collection("posts")

let router = express.Router()

// POST    /api/v1/post
router.post('/signup', async (req, res, next) => {

    if (!req.body.email ||
        !req.body.password
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            email: "example@gmail.com",
            password: "########"
        } `);
        return;
    }

    const insertResponse = await col.insertOne({
        email: req.body.email,
        password: req.body.password
    })
    console.log(insertResponse)

    res.send('signup done');
})


export default router
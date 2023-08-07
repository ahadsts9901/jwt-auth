import express from 'express';
import { client } from '../../mongodb.mjs'
import { ObjectId } from 'mongodb';
import {
    stringToHash,
    varifyHash
} from "bcrypt-inzi"

const db = client.db("cruddb")
const col = db.collection("users")

let router = express.Router()

// login

router.post('/login', async(req, res, next) => {

    if (!req.body.email ||
        !req.body.password
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            email: "example@gmail.com",
            password: "pa$$word",
        } `);
        return;
    }
    req.body.email = req.body.email.toLowerCase();

    try {
        let result = await col.findOne({ email: req.body.email });
        console.log("result: ", result);

        if (!result) { // user not found
            res.status(403).send({
                message: "email or password incorrect"
            });
            return;
        } else { // user found
            const isMatch = await varifyHash(req.body.password, result.password)

            if (isMatch) {
                // TODO: create token for this user
                res.send({
                    message: "login successful"
                });
                return;
            } else {
                res.status(401).send({
                    message: "email or password incorrect"
                })
                return;
            }
        }

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }



})


// signup

router.post('/signup', async(req, res, next) => {

    if (!req.body.email ||
        !req.body.password ||
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.confirmPassword
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            firstName: "Abdul",
            lastName: "Ahad",
            email: "example@gmail.com",
            password: "11111111",
            confirmPassword: "11111111"
        } `);
        return;
    }

    res.send('signup done');
    try {
        req.body.email = req.body.email.toLowerCase();
        let result = await col.findOne({ email: req.body.email });
        console.log("result: ", result);

        if (!result) { // user not found

            const passwordHash = await stringToHash(req.body.password);

            const insertResponse = await col.insertOne({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: passwordHash,
                confirmPassword: passwordHash
            });
            console.log("insertResponse: ", insertResponse);

            res.send({ message: 'Signup successful' });

        } else { // user already exists
            res.status(403).send({
                message: "user already exist with this email"
            });
        }

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})


export default router
import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import 'dotenv/config'
const __dirname = path.resolve();

import authRouter from './routes/auth.mjs'
import postRouter from './routes/post.mjs'
import cookieParser from 'cookie-parser'
import { decode } from 'punycode';

const app = express();
app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser
app.use('/login', express.static(path.join(__dirname, 'public/login')))
app.use('/signup', express.static(path.join(__dirname, 'public/signup')))

app.use("/api/v1", authRouter)


app.use((req, res, next) => {
    console.log("cookies: ", req.cookies);

    const token = req.cookies.token;

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("decoded: ", decoded);

        req.body.decoded = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
        };

        next();

    } catch (err) {
        res.status(401).send(`
            <!DOCTYPE html>
            <html>
            
            <head>
                <meta charset="utf-8">
                </meta>
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                </meta>
                <title>Invalid</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                </meta>
                <!-- icons cdn -->
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
                </link>
                <!-- font cdn -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
                </link>
                <!-- bootstrap -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
                <style>
                    * {
                        font-family: "Josefin Sans", sans-serif;
                        font-weight: bold!important;
                        outline: none!important;
                    }
                    
                    body {
                        /* background-image: url(./background.png); */
                        /* background-repeat: repeat; */
                        /* background-position: center; */
                        background-color: #15182b!important;
                        color: #fff!important;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        row-gap: 2em!important;
                        padding: 2em 1em;
                        margin: 0em;
                        width: 100vw;
                        height: 100vh;
                    }
                    
                    i,
                    a,
                    p,
                    h1,
                    h2,
                    h3,
                    h4,
                    h5,
                    h6 {
                        margin: 0em!important;
                    }

                    a{
                        cursor: pointer;
                    }
                    
                    .center {
                        width: 100%;
                        text-align: center;
                    }
                </style>
            </head>
            
            <body>
                <h1 style="font-size: 3em; color: #b6d1fd;" class="center">Invalid Token</h1>
                <span class="center">
                    <p>Get Started By</p>
                    <a style="color: #b6d1fd;" onclick="window.location.pathname = '/login'">Logging In</a> Or
                    <a style="color: #b6d1fd;" onclick="window.location.pathname = '/signup'">Signing Up</a>
                </span>
            </body>
            
            </html>
            `)
    }

})

app.use("/api/v1", postRouter)
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})
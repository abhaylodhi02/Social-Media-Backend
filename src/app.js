import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//express => (err,req,res,next) next is flag, used for middleware

const app = express()

// configure cors for retrival of requests from valid source only(i.e. frontend) 
app.use(cors({
    // in env CORS_ORIGIN = URL or * (* accepts req from anywhere)
    origin: process.env.CORS_ORIGIN,
    credentials : true
    // refer cors docs for more
}))

// accepting data on server
app.use(express.json({limit : "16kb"}))

// for data from url
app.use(express.urlencoded({extended:true, limit: "16kb"}))

// for storing files on a folder
app.use(express.static("public"))

// TO perfrom CRUD over cookies on browser
app.use(cookieParser())


//Routes import

import userRouter from './routes/user.routes.js'



// routes declaration

app.use("/api/v1/users",userRouter)

// url like : http://localhost:8000/api/v1/users/register

export { app }
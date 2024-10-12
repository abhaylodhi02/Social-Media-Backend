import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at ${process.env.PORT}`);
    });
}) // after establishing connection do these:
.catch((err) => {
    console.log("Mongo db connection failed!!",err);
})


/*
Alternate way
import express from "express";

const app = express()

(async() => {
    try{
      mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      app.on("error", ()=>{
        console.log("ERROR ", error);
        throw error
      })
      app.listen(process.env.PORT, ()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
      })
    
    }catch(error){
        console.error("ERROR: ", error)
        throw err
    }
})()
*/
import mongoose, {Schema} from "mongoose";

const followSchema = new Schema({
    follower:{
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    followee:{
        type: Schema.Types.ObjectId, // one to whom 'subscriber is subscribing
        ref: "User" 
    }
},{timestamps: true})


export const Follow = mongoose.model("Follow", followSchema)
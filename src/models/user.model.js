import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

//JWT is a bearer token, like a key for the one who want to retrieve data

const userSchema = new Schema({
    
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true  // indexing makes search faster in db
        
   
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, // cloudinary url
        required: true,
    },
    coverImage:{
        tyre: String,   
    },
    postHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    password:{
        type: String,
        required: [true, 'Password is required!']
    },
    refreshToken:{
        type: String
    },

    
},
{
    timestamps: true
})

// async as encryption takes time and also takes reference for next
// arrow func is not used as they do not have reference to this
userSchema.pre("save", async function(next){
    
    if(!this.isModified("password")) return next();
    
    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
     
} 

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userScheman.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)
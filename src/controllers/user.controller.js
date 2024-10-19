import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // putting refresh token in db
        user.refreshToken = refreshToken

        /*
        When we try to save directly it will seek for other 
        fields associated to user as well(such as password, email,),
        that is why validateBeforeSave is set false to save tokens 
        directly without validating others 
        */
        await user.save({validateBeforeSave: false}) 
        
        // return tokens to user
        return {accessToken, refreshToken}


    }catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token!");
    }
}



const registerUser = asyncHandler( async(req,res) => {
    // Trial
    // res.status(200).json({
    //     message: "ok"
    // })

    /* 
    Steps for user registration:
    1. Get the user details
    2. Validation - not empty
    3. check if user already exists: username,email
    4. check for images, check for avatar
    5. upload the to cloudinary, avatar
    6. create user object - create entry in db
    7. remove password and refresh token field from response
    8. check for user creation 
    9. return response(res)
    */

    const {fullName,email, username, password, } = req.body
    console.log("email: ",email);

    // if(fullName ===""){
    //     throw new ApiError(400, "full name is required");
    // }

    if(
        [fullName,email,username,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required!");
    }
     // use await for db calls
     const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists!")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
      coverImageLocalPath = req.files.coverImage[0].path;   
    }


    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        // - sign for those you don't want to select
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    );
    

})

                               //(req, _ ) if res is not available
const loginUser = asyncHandler(async(req,res) =>{

    /* Steps:
    1. req body -> data
    2. username or email
    3. find the user
    4. password check
    5. access and refresh token
    6. send cookies to transfer tokens
    */

    const {email, username, password} = req.body;

    if(!username && !email){
        throw new ApiError(400, "username or email is required!");
    }
    
    const user = await User.findOne({
        // mongodb operator -> $..
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password!");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    // send tokens through cookies

    const loggedInUser = User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        // if user is trying to save tokens locally
        new ApiResponse(
            200,
            {
                //****if user want to save data locally****

                // user: loggedInUser, accessToken,
                // refreshToken
            },
            "User logged in Successfully!"
        )
    )
 
})


const logoutUser = asyncHandler(async(req,res)=>{
    /*
     1.Remove cookies at first
    */
     
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            // return the new undefined value rather than already stored tokens and cookies
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "User Logged Out!"))
    
})


const refreshAccessToken = asyncHandler(async(req,res)=>{

    const incomingRefreshToken  = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
        
    }

   try{
    
        const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
        )


        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401,"Invalid refresh token!") 
        }
        
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
        
        return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refreshToken",newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    }catch(error){
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}
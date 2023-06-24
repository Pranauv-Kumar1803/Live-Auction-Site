const User = require("../models/User.js");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const login = async(req,res,next)=>{
    try {
        const {email,password} = req.body;

        const user = await User.findOne({email: email}).exec();

        if(!user) {
            return next(createError(404,'user not found'));
        }
        
        const check = await bcrypt.compare(password, user.password);
        
        if(!check) {
            return next(createError(400,'Wrong Password Entered'));
        }

        const token = await jwt.sign(
            {
                user: user
            },
            process.env.ACCESS_TOKEN_SECRET
        );
        
        res.cookie('access_token',token,{
            httpOnly: true,
            secure: true,
            maxAge: 6 * 60 * 60 * 1000
        })

        res.end();
    } catch (err) {
        next(err);
    }
}

const signup = async(req,res,next)=>{
    try {
        const user = await User.findOne({email: req.body.email}).exec();

        if(user) {
            return next(createError(400,'User Already Exists!'));
        }

        const newPassword = await bcrypt.hash(req.body.password,10);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
        })

        await newUser.save();
        res.status(200).json(newUser);

    } catch (err) {
        next(err);
    }
}

const getUser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.user).exec();

        if(!user)
        {
            return res.status(404).json({message: "no user found!"});
        }

        return res.status(200).json({data: user});
        
    } catch (err) {
        next(err);
    }
}

const logout = (req,res, next)=>{
    try {
        res.clearCookie('access_token',{
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        
        return res.redirect('/');
    } catch (err) {
        next(err);
    }
}

module.exports = {login, signup, getUser, logout};
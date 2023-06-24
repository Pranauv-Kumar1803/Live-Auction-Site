const express = require("express");
const {login, signup, getUser, logout} = require('../controllers/authController.js');
const verifyToken = require("../verifyToken.js");

const router = express.Router();

router.get('/login',(req,res,next)=>{
    res.render('login');
})

router.get('/signup',(req,res,next)=>{
    res.render('signup');
})

router.post('/login',login);
router.post('/signup',signup);

router.get('/current_user',verifyToken,getUser);

router.get('/logout',verifyToken, logout)

module.exports = router;
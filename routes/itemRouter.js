const express = require("express");
const { getItem, getAllItems, addItem, getAllOrders } = require('../controllers/itemController.js');
const verifyToken = require("../verifyToken.js");

const router = express.Router();

router.get('/',getAllItems);

router.get('/add',verifyToken,(req,res)=>{
    res.render('addItem',{login: true});
});

router.get('/orders',verifyToken,getAllOrders);

router.post('/add',verifyToken,addItem);

router.get('/:id',verifyToken,getItem);

module.exports = router;
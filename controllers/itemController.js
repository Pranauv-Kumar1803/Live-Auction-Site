const User = require("../models/User.js");
const Item = require("../models/Item.js");
const crypto = require('crypto');
const { timer } = require('../timer.js');

const getItem = async (req, res, next) => {
    try {
        const item = await Item.findOne({ itemId: req.params.id }).exec();

        if (!item) {
            return res.redirect('/first');
        }

        return res.render('index', { data: item, time: 5, user: req.user, login: true });
    } catch (err) {
        next(err);
    }
}

const getAllItems = async (req, res, next) => {
    try {
        const items = await Item.find({ available: true }).exec();
        if (!req.cookies) {
            return res.render('home', { data: items, login: false });
        }
        res.render('home', { data: items, login: true });
    } catch (err) {
        next(err);
    }
}

const addItem = async (req, res, next) => {
    try {
        const { name, description, price, image } = req.body;
        let newItem;
        const item = crypto.randomUUID();
        if (!image) {
            newItem = new Item({
                name: name,
                description: description,
                starting_price: price,
                itemId: item
            })
        }
        else {
            newItem = new Item({
                name: name,
                description: description,
                starting_price: price,
                image: image,
                itemId: item
            })
        }

        await newItem.save();

        timer[item] = 300;

        return res.status(201).json(newItem);
    } catch (err) {
        next(err);
    }
}

const getAllOrders = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);
        const items = user.items;

        const list = await Promise.all(
            items.map((item) => {
                return Item.findOne({ itemId: item.itemId, available: false })
            })
        )

        return res.render('orders', { list, login: true });
    } catch (err) {
        next(err);
    }
}

module.exports = { getItem, getAllItems, addItem, getAllOrders };
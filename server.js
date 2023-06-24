require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: "*" } });
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter.js');
const itemRouter = require('./routes/itemRouter.js');
const verifyToken = require('./verifyToken.js');
const Item = require('./models/Item.js');
const {timer} = require('./timer.js');
const User = require('./models/User.js');

// middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(cookieParser());

// routes
let rooms = {};
let users = [];

app.get('/', verifyToken, (req, res) => {
    if(req.user)
    {
        return res.redirect('/item');
    }
    res.redirect('/auth/login');
})

app.use('/auth', authRouter);
app.use('/item', itemRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went Wrong!";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

io.on('connection', (socket) => {
    console.log('user connected ' + socket.id);

    socket.on('new_connection', async ({ itemId, userId }) => {
        users.push({ userId: socket.id });
        socket.join(itemId);
        const arr = rooms[itemId] || [];
        arr.push(socket.id);
        rooms[itemId] = arr;

        io.sockets.in(socket.id).emit('timer', timer[itemId]);
    })

    socket.on('new_bid', async ({ itemId, newBid, userId }) => {

        const it = await Item.findOne({ itemId: itemId });

        if (!it.lastBid) {
            timer[itemId] = 300;
        }

        it.lastBid = {
            userId: userId,
            bid: Number(newBid)
        };

        await it.save();
        socket.broadcast.to(itemId).emit('current_bid', newBid);
    })

    socket.on('timerChange', async ({ itemId, time }) => {
        timer[itemId] = time;
    })

    socket.on('close_item',async({itemId})=>{
        delete rooms[itemId];
        delete timer[itemId];

        const item = await Item.findOne({itemId: itemId});
        if(JSON.stringify(item.lastBid)!=='{}')
        {
            const user = await User.findById(item.lastBid.userId);
            if(user.items && !user.items.includes({itemId: item.itemId}))
            {
                await user.items.push({itemId: item.itemId, price: item.lastBid.bid});
                await user.save();
            }
        }

        item.available = false;
        await item.save();
    })
})

mongoose.connect('mongodb+srv://pranauv1803:GC4NkcG03ouASXvw@cluster0.d8evjpw.mongodb.net/Auction').then(() => {
    server.listen(5500, () => {
        console.log('server running on port 5500');
    })
})
const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

const studentRouter = require('./student/router')

app.use(express.json())

app.use(studentRouter)

//Value of Process time check
let false_In;
let pause = 5000;
let lock_false = true;
let take_falseTime;

let u_false_In;
let u_lock_false = true;
let u_take_falseTime;

let dressTop = false
let dressUnder = false

// MicroGear NETPIE Setup
const MicroGear = require('microgear')
const APPID = 'ROD'
const KEY = 'TwDiblq4TwrZfhv'
const SECRET = '8XDRozETtH4cgMNqT0O3y288n'


var microgear = MicroGear.create({
    gearkey: KEY,
    gearsecret: SECRET,
    alias: "expressPi"
})

microgear.on('connected', function() {
    console.log('Connected...');
});

microgear.on('message', async function(topic, body) {
    if (body == 'top_true') {
        if (lock_false) {
            lock_false = false;
            console.log('Dress is true--------------!!');
            //set value is true for sending is here
            dressTop = true
        }
        take_falseTime = true;
    } else if (body == 'top_false') {
        if (take_falseTime) {
            false_In = new Date().getTime();
            take_falseTime = false;
        }

        if (!lock_false && (new Date().getTime() - false_In) > pause) {
            lock_false = true;
            console.log('Dress is false--------------!!');
            //set value is true for sending is here
            dressTop = false
        }
    } else if (body == 'under_true') {
        if (u_lock_false) {
            u_lock_false = false;
            console.log('Dress is true-----Under---------!!');
            //set value is true for sending is here
            dressUnder = true
        }
        u_take_falseTime = true;
    } else if (body == 'under_false') {
        if (u_take_falseTime) {
            u_false_In = new Date().getTime();
            u_take_falseTime = false;
        }

        if (!u_lock_false && (new Date().getTime() - u_false_In) > pause) {
            u_lock_false = true;
            console.log('Dress is false-----Under---------!!');
            //set value is true for sending is here
            dressUnder = false
        }
    } else {
        let resDress
        let key = body.toString()
        if (dressTop == true && dressUnder == true) {
            resDress = 'ถูกระเบียบ'
        } else {
            resDress = 'ผิดระเบียบ'
        }
        let data = {
            key: key,
            resDress: resDress
        }
        console.log('Scan Key Card, ID: ' + body + ' Top: ' + dressTop + ' Under: ' + dressUnder);
        broadcastData(data)
    }
    console.log('incoming : ' + topic + ' : ' + body);
});

microgear.on('closed', function() {
    console.log('Closed...');
})

microgear.connect(APPID)


async function broadcastData(data) {
    await io.emit('studentData', data);
}

io.on('connection', (socket) => {
    console.log('Socket.io Client connected')

    socket.on('studentData', (msg) => {
        console.log('message: ' + msg);

        //send with client send to server
        broadcastData(msg)
    })
})

http.listen(3000, () => console.log('start at port 3000'))
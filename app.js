const express = require('express');
const app = express()
const mongoose = require('mongoose');
const session = require('express-session');
const rateLimit = require('express-rate-limit')

const studRoutes = require('./routes/studentRoutes')
const rateLimiter = rateLimit({
    windowMs: 15* 60* 1000,
    max: 100,
    msg: 'Too many request to this IP. Please try again later.'
})

require('dotenv').config()
const port = process.env.PORT;

app.set('view engine', 'ejs');

app.use(express.json());   
app.use(rateLimiter);                                                                                                                                               
app.use(express.urlencoded({ extended: true}))


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
}))

app.use('/', studRoutes);

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Mongodb connected...');
})
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is listening at port ${port}`);
        
    })
})
.catch((error)=>{
    console.log(error);
    
})
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const dashboard = require('./routes/users');
const donateRoute = require('./routes/donor');
const path = require('path');
const verify = require('./routes/verify');
const cookieParser = require('cookie-parser');
const app = express();
const Donor = require('./models/donorModel');

dotenv.config();

mongoose.connect(process.env.DATABASE,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('Connected to Db!');
    });


app.use(express.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use((req,res,next) => {
    console.log(req.cookies);
    res.locals.user = req.user;
    next()
})

app.use('/api/user', authRoute);
app.use('/api/user', dashboard);
app.use('/api/user', donateRoute);

//ROUTES
app.get('/', (req,res) => {
    res.status(200).render('base')
})
app.get('/signup',(req,res) => {
    res.status(200).render('sign-up')
})
app.get('/signin', (req,res) => {
    res.status(200).render('sign-in')
})
app.get('/donate', (req,res) => {
    res.status(200).render('donate')
})

app.get('/dashboard',verify, async (req,res)=>{
    const donors = await Donor.find();
    console.log(donors);
    res.status(200).render('dashboard',{
        donors
    });
})
app.get('/donate_confirm', (req,res) => {
    res.status(200).render('donate_confirm');
})

const port = 3000;
app.listen(port, () => {
    console.log("Server is online");   
});
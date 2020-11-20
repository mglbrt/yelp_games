// ====================
// IMPORTS
// ====================


// NPM Imports
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const morgan = require('morgan')
const LocalStrategy = require('passport-local').Strategy
const passport = require('passport');
const expressSession = require('express-session');

// Config Import
const config = require('./config')

// Route Imports
const gameRoutes = require('./routes/games')
const commentRoutes = require('./routes/comments')
const mainRoutes = require('./routes/main')
const authRoutes = require('./routes/auth')

// Model Imports
const Game = require('./models/game')
const comment = require('./models/comment')
const User = require('./models/user');

// ====================
// DEVELOPEMENT
// ====================
// Morgan
app.use(morgan('tiny'))

// Seed the DB
// const seed = require('./utils/seed')
// seed()

// ====================
// CONFIG
// ====================

// Body Parser Config
app.use(bodyParser.urlencoded({extended: true}))

// Mongoose Config
mongoose.connect(config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
 
// Express Config
app.set("view engine", "ejs")
app.use(express.static('public'))

// Express Session Config
app.use(expressSession({
	secret:"3324-5225-157984",
	resave: false,
	saveUninitialized: false
}))

// Method-Overrride Config
app.use(methodOverride('_method'))

// Passport Config
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

// Current User Middleware Config
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
})

// Route Config
app.use("/", mainRoutes)
app.use("/", authRoutes)
app.use("/videogames", gameRoutes)
app.use("/videogames/:id/comments",commentRoutes)

// ====================
// LISTEN
// ====================
app.listen(3000,() => {
	console.log("App listening on port 3000!")
})
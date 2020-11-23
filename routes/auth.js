const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport');

// Sign Up - New
router.get('/signup', (req, res) => {
	res.render('signup')
})

// Sign Up - Create
router.post('/signup', async (req, res) => {
	try {
		const newUser = await User.register(new User({
			username: req.body.username,
			email: req.body.email
		}), req.body.password);
		req.flash("success", `You are now signed up as ${newUser.username}`)
		passport.authenticate('local')(req, res, () => {
			res.redirect('/videogames');
		})
	} catch(err) {
		console.log(err)
		res.send('broke at... //signup create', err)
	}
})

// Login - show form
router.get('/login', (req, res) => {
	 res.render('login')
 })

// Login
router.post('/login', passport.authenticate('local', {
	successRedirect: '/videogames',
	failureRedirect: '/login',
	failureFlash: true,
	successFlash: "Logged in successfully"
	
}))

// Logout
	router.get('/logout', (req, res) => {
	req.logout()
	req.flash("success", "Logged you out!")
	res.redirect('/')
})

module.exports = router
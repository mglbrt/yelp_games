const express = require('express')
const router = express.Router()
const Game = require('../models/game')
const Comment = require('../models/comment')
const isLoggedIn = require('../utils/isLoggedIn')
const checkGameOwner = require('../utils/checkGameOwner')

// index
router.get("/", async (req, res) => {
	console.log(req.user)
	try {
		const videogames = await Game.find().exec()
		res.render("videogames", {videogames}) 
	} catch(err) {
		console.log(err);
		res.send("you broke it")
	}

})

// create
router.post("/", isLoggedIn, async (req, res) => {
	
	const genre = req.body.genre.toLowerCase()
	const newGame = {
		title: req.body.title,
		description: req.body.description,
		company: req.body.company,
		publisher: req.body.publisher,
		releaseDate: req.body.releaseDate,
		series: req.body.series,
		genre,
		rating: req.body.rating,
		platform: req.body.platform,
		image_link: req.body.image_link,
		owner: {
			id: req.user._id,
			username: req.user.username
		}
	}
	try{
		const game = await Game.create(newGame)
		console.log(game)
		res.redirect("/videogames/" + game._id)
	} catch(err) {
		console.log(err)
		res.send("you broke it.../create")
	}3
})

// new
router.get("/new", isLoggedIn,(req,res) => {
	res.render("videoGames_new")
})

// Search
router.get("/search", async (req, res) =>{
	try{
		const videogames = await Game.find({
			$text: {
				$search: req.query.term
			}
		})
		res.render("videogames", {videogames})
	} catch(err) {
		console.log(err)
		res.send("broke....//search")
	}
})

//Genre
router.get("/genre/:genre", async (req, res) => {
	const validGenres = ["fps", "action-adventure", "platform", "looter shooter", "fighter", "adventure", "battle-royale", "racing", "sports", "horror"];
	if(validGenres.includes(req.params.genre.toLowerCase())) {
	   const videogames = await Game.find({genre: req.params.genre}).exec();
		res.render("videogames", {videogames})
	   } else {
		   res.send("Please enter a valid Genre..")
	   }
})

// show
router.get("/:id", async (req, res) => {
	try {
			const game = await Game.findById(req.params.id).exec()
			const comments = await Comment.find({gameId: req.params.id})
			res.render("games_show", {game, comments})
	} catch(err) {
		console.log(err)
		res.send("you broke it.../show")
	}
})

// edit
router.get("/:id/edit", checkGameOwner, async (req, res) => {
	const game = await Game.findById(req.params.id).exec()
	res.render("games_edit", {game})
})

// update
router.put("/:id", checkGameOwner, async (req, res) => {
	const genre = req.body.genre.toLowerCase()
	const gameBody = {
		title: req.body.title,
		description: req.body.description,
		company: req.body.company,
		publisher: req.body.publisher,
		releaseDate: req.body.releaseDate,
		series: req.body.series,
		genre,
		rating: req.body.rating,
		platform: req.body.platform,
		image_link: req.body.image_link
	}
	try{
		const game = await Game.findByIdAndUpdate(req.params.id, gameBody, {new: true}).exec()
		res.redirect(`/videogames/${req.params.id}`)
	} catch(err){
		console.log(err)
		res.send("broken.../update")
	}
})

// delete
router.delete("/:id", checkGameOwner, async (req, res) => {
	try{
		const deletedGame = await Game.findByIdAndDelete(req.params.id).exec()
	
		console.log("Deleted:", deletedGame)
		res.redirect("/videogames")
	} catch(err) {
		console.log(err)
		res.send("broke.../delete")
	}
})

module.exports = router
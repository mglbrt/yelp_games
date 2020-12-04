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
		trailer: req.body.trailer,
		image_link: req.body.image_link,
		owner: {
			id: req.user._id,
			username: req.user.username
		},
		upvotes:[req.user.username],
		downvotes:[]
	}
	try{
		const game = await Game.create(newGame)
		req.flash("success", "Successfully added new game to library!")
		res.redirect("/videogames/" + game._id)
	} catch(err) {
		req.flash("error", "Error adding game..")
		res.redirect("/videogames")
	}
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
	const validGenres = ["fps", "action-adventure", "platform", "lootershooter", "fighter", "adventure", "battle-royale", "racing", "sports", "horror", "sandbox", "vehiclecombat", "lifesimulation"];
	if(validGenres.includes(req.params.genre.toLowerCase())) {
	   const videogames = await Game.find({genre: req.params.genre}).exec();
		res.render("videogames", {videogames})
	   } else {
		   res.send("Please enter a valid Genre..")
	   }
})

// Vote
router.post("/voteType", isLoggedIn, async (req, res) => {
	console.log("Request body:", req.body)
	const game = await Game.findById(req.body.gameId)
	const alreadyUpvoted = game.upvotes.indexOf(req.user.username)
	const alreadyDownvoted = game.downvotes.indexOf(req.user.username)
	
	let response = {}
	if(alreadyUpvoted === -1 && alreadyDownvoted === -1) {
		if (req.body.voteType === "up") {
			game.upvotes.push(req.user.username)
			game.save()
			response = {message: "Upvote tallied!", code: 1}
		} else if (req.body.voteType === "down") {
			game.downvotes.push(req.user.username)
			game.save()
			response =  {message: "Downvote tallied!", code: -1}
		} else {
			response = {message: "Error 1", code: "err"}
		}
		} else if (alreadyUpvoted >=0) {
		if (req.body.voteType === "up"){
			game.upvotes.splice(alreadyUpvoted, 1)
			game.save()
			response = {message: "Upvote removed", code: 0}
		} else if (req.body.voteType === "down") {
			game.upvotes.splice(alreadyUpvoted, 1)
			game.downvotes.push(req.user.username)
			game.save()
			response = {message: "Changed to Downvote", code: -1}
		} else {
			response = {message: "Error 2", code: "err"}
		}
		} else if (alreadyDownvoted >=0){
		if (req.body.voteType === "up"){
			game.downvotes.splice(alreadyDownvoted, 1)
			game.upvotes.push(req.user.username)
			game.save()
			response = {message: "Changed to Upvote", code: 1}
		} else if (req.body.voteType === "down") {
			game.downvotes.splice(alreadyDownvoted, 1)
			game.save()
			response = {message: "Downvote removed!", code: 0}
		} else {
		response = {message: "Error 3", code: "err"}
		} 
	} else {
		response = {message: "Error 4", code: "err"}
	}
		response.score = game.upvotes.length - game.downvotes.length
	
		res.json(response)
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
		trailer: req.body.trailer,
		image_link: req.body.image_link
	}
	try{
		const game = await Game.findByIdAndUpdate(req.params.id, gameBody, {new: true}).exec()
		req.flash("success", "Successfully updated game info!")
		res.redirect(`/videogames/${req.params.id}`)
	} catch(err){
		console.log(err)
		req.flash("error", "Error updating game info..")
		res.redirect("/videogames")
	}
})

// delete
router.delete("/:id", checkGameOwner, async (req, res) => {
	try{
		const deletedGame = await Game.findByIdAndDelete(req.params.id).exec()
	
		console.log("Deleted:", deletedGame)
		req.flash("success", "Successfully deleted game from library!")
		res.redirect("/videogames")
	} catch(err) {
		console.log(err)
		req.flash("error", "Error deleting game from library..")
		res.redirect("back")
	}
})

module.exports = router
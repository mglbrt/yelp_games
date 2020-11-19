const express = require('express')
const router = express.Router({mergeParams: true})
const Comment = require('../models/comment')
const Game = require('../models/game')
const isLoggedIn = require('../utils/isLoggedIn')
const checkCommentOwner = require('../utils/checkCommentOwner')

//new comment - show form
router.get("/new", isLoggedIn, (req, res) => {
	res.render("comments_new", {gameId: req.params.id})
})

//create comment - actually update db
router.post("/", isLoggedIn, async (req, res) => {
	try {
		const comment = await Comment.create({
			user: {
					id: req.user._id,
					username: req.user.username
				},
			text: req.body.text,
			gameId: req.body.gameId
		})
	console.log(comment)
	res.redirect(`/videogames/${req.body.gameId}`)
	} catch(err) {
		console.log(err)
		res.send("broke... //comment update db")
	}
})

// Edit Comment
router.get("/:commentId/edit", checkCommentOwner, async (req, res) => {
	try{
		const game = await Game.findById(req.params.id).exec()
		const comment = await Comment.findById(req.params.commentId).exec()
		console.log("game:", game)
		console.log("comment:", comment)
		res.render("comments_edit", {game, comment})
	} catch(err) {
		console.log(err)
		res.send("broke.../editComment")
	}
})
// Update Comment
router.put("/:commentId", checkCommentOwner, async (req, res) => {
	try{
		const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new: true})
		console.log(comment)
		res.redirect(`/videogames/${req.params.id}`)
	} catch(err) {
		console.log(err)
		res.send("broke...//commentupdate")
	}
})
// Delete Comment
router.delete("/:commentId", checkCommentOwner, async (req, res) => {
	try{
		const comment = await Comment.findByIdAndDelete(req.params.commentId)
		console.log(comment)
		res.redirect(`/videogames/${req.params.id}`)
	} catch(err) {
		console.log(err)
		res.send("broke...//commentdelete")
	}
})

module.exports = router;

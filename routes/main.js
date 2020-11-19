const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
	res.render("landing")
})

// app.get("/act-adv", (req, res) => {
// 	res.render("rpg", {rpg})
// })

// app.get("/fps", (req, res) => {
// 	res.render("fps", {fps})
// })

module.exports = router
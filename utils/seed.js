const game = require('../models/game')
const Comment = require('../models/comment')


const game_seeds = [
	{
	title: "Grand Theft Auto: V" ,
		description:" Grand Theft Auto V is a 2013 action-adventure game developed by Rockstar North and published by Rockstar Games. It is the first main entry in the Grand Theft Auto series since 2008's Grand Theft Auto IV. ",
		company: "Rockstar Games",
		publisher: "Take-Two Interactive",
		releaseDate: "9/17/2013",
		series:"Grand Theft Auto",
		genre: "Action-Adventure",
		rating: "M",
		platform: "PS3, PS4, PS5, Xbox360, XboxOne, Xbox Series X, PC" ,
		image_link: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png" 
	}
]

const seed = async () => {
	
// delete all current games and comments
	await game.deleteMany()
	console.log("deleted all the games")
	
	await Comment.deleteMany()
	console.log("Deleted all the comments")
	
// //create 3 new games
// 	for (const game_seed of game_seeds) {
// 		let Game = await game.create(game_seed)
// 		console.log("created a new game:", Game.title)
// //create a new comment for each game
// 		const comment = await Comment.create({
// 			text:"good game",
// 			user:"mglbrt",
// 			gameId: Game._id
// 		})
// 		console.log("created new comment")
// 	}
}
module.exports = seed
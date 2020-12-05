const mongoose = require('mongoose')
const gameSchema = new mongoose.Schema({
	title: String,
	description: String,
	company: String,
	publisher: String,
	releaseDate: Date,
	series: String,
	genre: String,
	rating: String,
	platform: String,
	purchase_link: String,
	trailer: String,
	image_link: String,
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	upvotes:[String],
	downvotes:[String]
	
})

gameSchema.index({
	'$**': 'text'
})

module.exports =  mongoose.model("game", gameSchema)
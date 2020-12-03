//========================
// SELECT ELEMENTS
//========================
const upvoteBtn = document.getElementById("upvote_btn")
const downvoteBtn = document.getElementById("downvote_btn")
const score = document.getElementById("score")



//========================
// HELPER FUNCTIONS
//========================
const sendVote = async(voteType) => {
	const options = {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		}
	}
	
	if (voteType === "up" ){
		options.body = JSON.stringify({
			voteType: "up",
			gameId
		})
	} else if(voteType === "down"){
		options.body = JSON.stringify({
			voteType: "down",
			gameId
		})
	} else {
		throw "voteType must be 'up' or 'down'" 
	}
	await fetch("/videogames/voteType", options)
	.then(data => {
		return data.json()
	})
	.then(res => {
		console.log(res)
		handleVote(res.score, res.code)
	})
	.catch(err => {
		console.log(err)
	})
	
}

const handleVote = (newScore, code) => {
	score.innertext = newScore
	
	if(code === 0 ) {
		upvoteBtn.classList.remove("btn-success")
		upvoteBtn.classList.add("btn-outline-success")
		downvoteBtn.classList.remove("btn-danger")
		downvoteBtn.classList.add("btn-outline-danger")
	} else if (code === 1){
		upvoteBtn.classList.remove("btn-outline-success")
		upvoteBtn.classList.add("btn-success")
		downvoteBtn.classList.remove("btn-danger")
		downvoteBtn.classList.add("btn-outline-danger")
	} else if (code === -1) {
		upvoteBtn.classList.remove("btn-success")
		upvoteBtn.classList.add("btn-outline-success")
		downvoteBtn.classList.remove("btn-outline-danger")
		downvoteBtn.classList.add("btn-danger")
	} else {
		console.log("Error in handleVote")
	}
}

//========================
// ADD EVENT LISTENERS
//========================
upvoteBtn.addEventListener("click", async function() {
	sendVote("up")
})

downvoteBtn.addEventListener("click", async function() {
	sendVote("down")
})
const express = require('express')
const path = require('path')
const app = express()
const compression = require('compression')
const cors = require('cors')
const axios = require('axios')
const workerpool = require('workerpool')
const fs = require('fs')

app.use(compression())
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client/build')));

const getAllPlayers = async () => {
    let allplayers = await axios.get('https://api.sleeper.app/v1/players/nfl', { timeout: 3000 })
    let ap = JSON.stringify(allplayers.data)
	fs.writeFileSync('../client/src/allPlayers.json', ap)
    app.set('allplayers', ap)
}
getAllPlayers()
setInterval(getAllPlayers, 1000 * 60 * 60 * 24)

app.get('/user', async (req, res) => {
	const username = req.query.username
	try {
		const user = await axios.get(`https://api.sleeper.app/v1/user/${username}`, { timeout: 3000 })
		res.send(user.data)
	} catch (error) {
		res.send(error)
	}
})

app.get('/dynastyvalues', async (req, res) => {
    const poolDV = workerpool.pool(__dirname + '/workers/workerDV.js')
    const result = await poolDV.exec('get_proj', [app.settings.allplayers])
    res.send(result)
})

app.get('/leagues', async (req, res) => {
    const username = req.query.username
    const state = await axios.get(`https://api.sleeper.app/v1/state/nfl`, { timeout: 3000 })
    const season = state.data.league_season
    const week = state.data.display_week
    const poolLeagues = workerpool.pool(__dirname + '/workers/workerLeagues.js')
    const result = await poolLeagues.exec('getLeagues', [username, season, week])
    res.send(result)
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`server running on port ${port}`);
});
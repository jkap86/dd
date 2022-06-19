const express = require('express');
const router = express.Router();
const axios = require('axios')

const getTransactions = async (username, season) => {
    const user = await axios.get(`https://api.sleeper.app/v1/user/${username}`)
    let transactions = []
    const leagues = await axios.get(`https://api.sleeper.app/v1/user/${user.data.user_id}/leagues/nfl/${season}`)

    await Promise.all(leagues.data.map(async league => {
        const [users, rosters, drafts] = await Promise.all([
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/users`),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/rosters`),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/drafts`)
        ])
        await Promise.all(Array.from(Array(17).keys()).map(async week => {
            const t = await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/transactions/${week + 1}`).catch((err) => { return { data: [] } })
            t.data.map(transaction => {
                const traders = transaction.roster_ids.map(rid => {
                    const r = rosters.data.find(x => x.roster_id === rid)
                    const u = users.data.find(x => x.user_id === r.owner_id)
                    return {
                        roster_id: rid,
                        owner_id: u === undefined ? null : u.owner_id,
                        avatar: u === undefined ? null : u.avatar,
                        username: u === undefined ? 'Orphan' : u.display_name
                    }
                })
                const picks = transaction.draft_picks.map(pick => {
                    const r = rosters.data.find(x => x.roster_id === pick.roster_id)
                    const u = users.data.find(x => x.user_id === r.owner_id)
                    return {
                        ...pick,
                        original_username: u === undefined ? 'Orphan' : u.display_name
                    }
                })
                return transactions.push({
                    ...transaction,
                    league_name: league.name,
                    league_avatar: league.avatar,
                    league_id: league.league_id,
                    users: traders,
                    draft_picks: picks,
                    isTransactionHidden: false
                })

            })
        }))
    }))


    return transactions
}



router.get('/transactions', async (req, res, next) => {
    const username = req.query.username
    const state = await axios.get(`https://api.sleeper.app/v1/state/nfl`, { timeout: 3000 })
    const season = state.data.league_season
    const result = await getTransactions(username, season)
    res.send(result)
    next
})

module.exports = router
const workerpool = require('workerpool')
const axios = require('axios')



const getLeagues = async (username, season, week) => {
    const user = await axios.get(`https://api.sleeper.app/v1/user/${username}`, { timeout: 3000 })
    const l = await axios.get(`https://api.sleeper.app/v1/user/${user.data.user_id}/leagues/nfl/${season}`, { timeout: 3000 })

    const leagues = []
    await Promise.all(l.data.map(async (league, index) => {
        const [rosters, users, matchups] = await Promise.all([
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/rosters`, { timeout: 3000 }),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/users`, { timeout: 3000 }),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/matchups/${week}`, { timeout: 3000 })
        ])
        rosters.data = rosters.data.map(roster => {
            const roster_user = users.data.find(x => x.user_id === roster.owner_id)
            return {
                ...roster,
                username: roster_user === undefined ? 'Orphan' : roster_user.display_name,
                avatar: roster_user === undefined ? null : roster_user.avatar,
                isRosterHidden: true,
                wins: week < 1 ? roster.metadata === null || roster.metadata.record === undefined || roster.metadata.record.match(/W/g) === null ?
                    0 : roster.metadata.record.match(/W/g).length
                    : roster.settings.wins,
                losses: week < 1 ? roster.metadata === null || roster.metadata.record === undefined || roster.metadata.record.match(/L/g) === null ?
                    0 : roster.metadata.record.match(/L/g).length
                    : roster.settings.losses,
                ties: week < 1 ? roster.metadata === null || roster.metadata.record === undefined || roster.metadata.record.match(/T/g) === null ?
                    0 : roster.metadata.record.match(/T/g).length
                    : roster.settings.ties,
                fpts: parseFloat(`${roster.settings.fpts}.${roster.settings.fpts_decimal === undefined ? 0 : roster.settings.fpts_decimal}`),
                fpts_against: parseFloat(`${roster.settings.fpts_against === undefined ? 0 : roster.settings.fpts_against}.${roster.settings.fpts_against_decimal === undefined ? 0 : roster.settings.fpts_against_decimal}`)
            }
        })
        const userRoster = rosters.data.find(x => x.owner_id === user.data.user_id)
        const matchup = matchups.data.find(x => x.roster_id === userRoster.roster_id)
        const matchup_opponent = matchups.data.find(x => x.matchup_id === matchup.matchup_id && x.roster_id !== matchup.roster_id)
        const opponent = matchup_opponent === undefined ? 'orphan' : rosters.data.find(x => x.roster_id === matchup_opponent.roster_id)
        leagues.push({
            ...league,
            index: index,
            bestball: league.settings.best_ball === 1 ? 'BestBall' : 'Standard',
            dynasty: league.settings.type === 2 ? 'Dynasty' : 'Redraft',
            rosters: rosters.data,
            userRoster: userRoster === undefined ? {} : userRoster,
            users: users.data,
            record: {
                wins: week < 1 ? userRoster.metadata === null || userRoster.metadata.record === undefined ?
                    0 : userRoster.metadata.record.match(/W/g).length
                    : userRoster.settings.wins,
                losses: week < 1 ? userRoster.metadata === null || userRoster.metadata.record === undefined ?
                    0 : userRoster.metadata.record.match(/L/g).length
                    : userRoster.settings.losses,
                ties: week < 1 ? userRoster.metadata === null || userRoster.metadata.record === undefined || userRoster.metadata.record.match(/T/g) === null ?
                    0 : userRoster.metadata.record.match(/T/g).length
                    : userRoster.settings.ties
            },
            fpts: userRoster === {} ? 0 : parseFloat(`${userRoster.settings.fpts}.${userRoster.settings.fpts_decimal === undefined ? 0 : userRoster.settings.fpts_decimal}`),
            fpts_against: userRoster === {} ? 0 : parseFloat(`${userRoster.settings.fpts_against === undefined ? 0 : userRoster.settings.fpts_against}.${userRoster.settings.fpts_against_decimal === undefined ? 0 : userRoster.settings.fpts_against_decimal}`),
            matchup: matchup,
            matchup_opponent: matchup_opponent,
            opponent: opponent === undefined ? 'orphan' : opponent,
            isLeagueHidden: false,
            isRostersHidden: true,
            isLeagueTypeHidden: false
        })
    }))
    return leagues
}

workerpool.worker({
    getLeagues: getLeagues
})
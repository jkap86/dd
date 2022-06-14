const workerpool = require('workerpool')
const axios = require('axios')

const getDraftPicks = (league, roster_id, season, traded_picks) => {
    let original_picks = []
    let y = league.status === 'in_season' ? 1 : 0
    Array.from(Array(3).keys()).map(x => x + y).map(year => {
        return Array.from(Array(league.settings.draft_rounds).keys()).map(x => x + 1).map(round => {
            return original_picks.push({
                season: (parseInt(season) + parseInt(year)).toString(),
                round: round,
                roster_id: roster_id,
                previous_owner_id: roster_id,
                owner_id: roster_id
            })
        })
    })
    traded_picks.filter(x => x.owner_id === roster_id).map(pick => {
        return original_picks.push(pick)
    })
    traded_picks.filter(x => x.previous_owner_id === roster_id).map(pick => {
        const index = original_picks.findIndex(obj => {
            return obj.owner_id === pick.previous_owner_id && obj.roster_id === pick.roster_id && obj.season === pick.season && obj.round === pick.round
        })
        return original_picks.splice(index, 1)
    })

    return league.status === 'in_season' ? original_picks.filter(x => x.season >= season + y) : original_picks
}

const getLeagues = async (username, season, week) => {
    const user = await axios.get(`https://api.sleeper.app/v1/user/${username}`, { timeout: 3000 })
    const l = await axios.get(`https://api.sleeper.app/v1/user/${user.data.user_id}/leagues/nfl/${season}`, { timeout: 3000 })

    const leagues = []
    await Promise.all(l.data.map(async (league, index) => {
        const [rosters, users, matchups, traded_picks] = await Promise.all([
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/rosters`, { timeout: 3000 }),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/users`, { timeout: 3000 }),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/matchups/${week}`, { timeout: 3000 }),
            await axios.get(`https://api.sleeper.app/v1/league/${league.league_id}/traded_picks`, { timeout: 3000 })
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
                fpts_against: parseFloat(`${roster.settings.fpts_against === undefined ? 0 : roster.settings.fpts_against}.${roster.settings.fpts_against_decimal === undefined ? 0 : roster.settings.fpts_against_decimal}`),
                draft_picks: league.settings.type === 2 ? getDraftPicks(league, roster.roster_id, season, traded_picks.data) : []
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
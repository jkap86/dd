import React, { useState, useMemo } from "react";
import allPlayers from '../allPlayers.json';
import Search from "./search";
import PlayerLeagues from "./playerLeagues";
import player_default from "../player_default.png";

const PlayerShares = (props) => {
    const [players, setPlayers] = useState([])
    const [filters, setFilters] = useState({ positions: [], types: [] })

    const filterPosition = (e) => {
        let f = filters.positions
        if (e.target.checked) {
            const index = f.indexOf(e.target.name)
            f.splice(index, 1)
        } else {
            f.push(e.target.name)
        }
        setFilters({ ...filters, positions: f })
    }

    const filterYearsExp = (e) => {
        let f = filters.types
        if (e.target.checked) {
            const index = f.indexOf(e.target.name)
            f.splice(index, 1)
        } else {
            f.push(e.target.name)
        }
        setFilters({ ...filters, positions: f })
    }
    const showLeagues = (player_id) => {
        let p = players
        p.filter(x => x.id === player_id).map(player => {
            return player.isRostersHidden = !player.isRostersHidden
        })
        setPlayers([...p])
    }

    const getSearched = (data) => {
        console.log(data)
        const p = players
        if (data) {
            p.map(player => {
                return player.isPlayerHidden = true
            })
            p.filter(player => data ===  `${allPlayers[player.id].full_name} ${allPlayers[player.id].position} ${allPlayers[player.id].team === null ? 'FA' : allPlayers[player.id].team}`)
                .map(player => {
                    return player.isPlayerHidden = false
                })
        } else {
            p.map(player => {
                return player.isPlayerHidden = false
            })
        }
        setPlayers([...p])
    }

    const getPlayerShares = (players_owned, players_taken) => {
        const ps = []
        players_owned.filter(x => allPlayers[x.id] !== undefined).forEach(p => {
            const index = ps.findIndex(obj => {
                return obj.id === p.id
            })
            if (index === -1) {
                ps.push({
                    id: p.id,
                    count: 1,
                    leagues: [p.league],
                    wins: p.wins,
                    losses: p.losses,
                    ties: p.ties,
                    fpts: p.fpts,
                    fpts_against: p.fpts_against
                })
            } else {
                ps[index].count++
                ps[index].leagues.push(p.league)
                ps[index].wins = ps[index].wins + p.wins
                ps[index].losses = ps[index].losses + p.losses
                ps[index].ties = ps[index].ties + p.ties
                ps[index].fpts = ps[index].fpts + p.fpts
                ps[index].fpts_against = ps[index].fpts_against + p.fpts_against
            }
        })
        const po = []
        players_taken.filter(x => allPlayers[x.id] !== undefined).forEach(p => {
            const index = po.findIndex(obj => {
                return obj.id === p.id
            })
            if (index === -1) {
                po.push({
                    id: p.id,
                    count: 1,
                    leagues: [p.league],
                    wins: p.wins,
                    losses: p.losses,
                    ties: p.ties,
                    fpts: p.fpts,
                    fpts_against: p.fpts_against
                })
            } else {
                po[index].count++
                po[index].leagues.push(p.league)
                po[index].wins = po[index].wins + p.wins
                po[index].losses = po[index].losses + p.losses
                po[index].ties = po[index].ties + p.ties
                po[index].fpts = po[index].fpts + p.fpts
                po[index].fpts_against = po[index].fpts_against + p.fpts_against
            }
        })
        let ap = Object.keys(allPlayers).filter(x => allPlayers[x].status === 'Active').map(player => {
            const match = ps.find(x => x.id === player)
            const leagues_owned = match === undefined ? [] : match.leagues
            const match_taken = po.find(x => x.id === player)
            const leagues_taken = match_taken === undefined ? [] : match_taken.leagues
            const leagues_available = props.leagues.filter(x => leagues_owned.find(y => y.league_id === x.league_id) === undefined &&
                leagues_taken.find(y => y.league_id === x.league_id) === undefined)
            return {
                id: player,
                position: ['QB', 'RB', 'WR', 'TE'].includes(allPlayers[player].position) ? allPlayers[player].position : 'Other',
                type: allPlayers[player].years_exp === 0 ? 'R' : 'V',
                leagues_owned: leagues_owned,
                leagues_taken: leagues_taken,
                leagues_available: leagues_available,
                count: match === undefined ? 0 : match.count,
                wins: match === undefined ? 0 : match.wins,
                losses: match === undefined ? 0 : match.losses,
                ties: match === undefined ? 0 : match.ties,
                fpts: match === undefined ? 0 : match.fpts,
                fpts_against: match === undefined ? 0 : match.fpts_against,
                isPlayerHidden: false,
                isRostersHidden: true,
            }
        })
        return ap
    }

    let playersOwned = props.leagues.map(league => {
        return league.rosters.filter(x => x.players !== null && x.owner_id === props.user.user_id).map(roster => {
            return roster.players.map(player => {
                return {
                    id: player,
                    league: league,
                    wins: league.record.wins,
                    losses: league.record.losses,
                    ties: league.record.ties,
                    fpts: league.fpts,
                    fpts_against: league.fpts_against
                }
            })
        })
    }).flat(2)
    let playersTaken = props.leagues.map(league => {
        return league.rosters.filter(x => x.players !== null && x.owner_id !== props.user.user_id).map(roster => {
            return roster.players.map(player => {
                return {
                    id: player,
                    league: league,
                    wins: roster.wins,
                    losses: roster.losses,
                    ties: roster.ties,
                    fpts: roster.settings.fpts,
                    fpts_against: roster.settings.fpts_against
                }
            })
        })
    }).flat(2)

    const p = useMemo(() => getPlayerShares(playersOwned, playersTaken), [props.leagues])
    if (p !== players) setPlayers(p)

    return <>
        <div className="search_wrapper">
            <div className="checkboxes">
                <label className="script">
                    QB
                    <input className="clickable" name="QB" onClick={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    RB
                    <input className="clickable" name="RB" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    WR
                    <input className="clickable" name="WR" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    TE
                    <input className="clickable" name="TE" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    Other
                    <input className="clickable" name="Other" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <br />
                <label className='script'>
                    Vets
                    <input className="clickable" name='V' onChange={(e) => filterYearsExp(e)} defaultChecked type="checkbox" />
                </label>
                <label className='script'>
                    Rookies
                    <input className="clickable" name='R' onChange={(e) => filterYearsExp(e)} defaultChecked type="checkbox" />
                </label>
            </div>
            <Search
                list={players.map(player =>
                    `${allPlayers[player.id].full_name} ${allPlayers[player.id].position} 
                        ${allPlayers[player.id].team === null ? 'FA' : allPlayers[player.id].team}`)}
                placeholder="Search Players"
                sendSearched={getSearched}
            />
        </div>
        <div className="view_scrollable">
            <table className="main">
                <tbody className="fade_in sticky">
                    <tr>
                        <th colSpan={1}>Count</th>
                        <th colSpan={3}>Player</th>
                        <th colSpan={1}>Age</th>
                        <th colSpan={1}>Yrs Exp</th>
                        <th colSpan={3}>Record</th>
                        <th colSpan={2}>Points For</th>
                        <th colSpan={2}>Points Against</th>
                        <th colSpan={2}>Value</th>
                    </tr>
                </tbody>
                <tbody className="slide_up">
                    {players.filter(x => x.isPlayerHidden === false && !filters.positions.includes(x.position) && !filters.types.includes(x.type))
                        .sort((a, b) => b.count - a.count).slice(0, 100).map((player, index) =>
                            <React.Fragment key={index}>
                                <tr onClick={() => showLeagues(player.id)} className={player.isRostersHidden ? "hover clickable" : "hover clickable active"}>
                                    <td>{player.count}</td>
                                    <td>
                                        <img
                                            style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                            className="thumbnail"
                                            alt="headshot"
                                            src={`https://sleepercdn.com/content/nfl/players/thumb/${player.id}.jpg`}
                                            onError={(e) => { return e.target.src = player_default }}
                                        />
                                    </td>
                                    <td colSpan={2} className="left">{allPlayers[player.id].full_name}</td>
                                    <td>{allPlayers[player.id].age}</td>
                                    <td>{allPlayers[player.id].years_exp}</td>
                                    <td colSpan={3}>
                                        <p className="record">
                                            {player.wins}-{player.losses}{player.ties === 0 ? null : `-${player.ties}`}
                                        </p>
                                        &nbsp;{
                                            player.wins + player.losses === 0 ? null :
                                                <em>{(player.wins / (player.wins + player.losses)).toFixed(4)}</em>
                                        }
                                    </td>
                                    <td colSpan={2}>{player.fpts}</td>
                                    <td colSpan={2}>{player.fpts_against}</td>
                                    <td colSpan={2}>{parseInt(props.matchPlayer_DV(player.id)).toLocaleString("en-US")}</td>
                                </tr>
                                {player.isRostersHidden === true ? null :
                                    <tr>
                                        <td colSpan={15}>
                                            <PlayerLeagues
                                                player={player.id}
                                                leagues_owned={player.leagues_owned}
                                                leagues_taken={player.leagues_taken}
                                                leagues_available={player.leagues_available}
                                                matchPlayer_DV={props.matchPlayer_DV}
                                                matchPick={props.matchPick}
                                            />
                                        </td>
                                    </tr>
                                }
                            </React.Fragment>
                        )}
                </tbody>
            </table>
        </div>
    </>
}
export default PlayerShares;
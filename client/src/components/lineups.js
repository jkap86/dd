import React, { useState, useEffect } from "react";
import allPlayers from '../allPlayers.json';
import player_default from '../player_default.png';
import LineupLeagues from "./lineupLeagues";
import Search from "./search";
import emoji from '../emoji.png';
import PlayerShares from "./playerShares";

const Lineups = (props) => {
    const [tab, setTab] = useState('All')
    const [playersAll, setPlayersAll] = useState([])
    const [starters, setStarters] = useState([])
    const [bench, setBench] = useState([])
    const [oppPlayers, setOppPlayers] = useState([])
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

    const getSearched = (data) => {
        let s = tab === 'Starters' ? starters : tab === 'Bench' ? bench : oppPlayers
        if (data) {
            s.map(starter => {
                return starter.isPlayerHidden = true
            })
            s.filter(x => (x.id === '0' && data === 'Empty') || (x.id !== '0' && allPlayers[x.id].full_name === data)).map(starter => {
                return starter.isPlayerHidden = false
            })

        } else {
            s.map(starter => {
                return starter.isPlayerHidden = false
            })
        }
        if (tab === 'Starters') {
            setStarters([...s])
        } else if (tab === 'Bench') {
            setBench([...s])
        } else {
            setOppPlayers([...s])
        }

    }

    const showLeagues = (player_id) => {
        const s = tab === 'All' ? playersAll : tab === 'Starters' ? starters : tab === 'Bench' ? bench : oppPlayers
        s.filter(x => x.id === player_id).map(starter => {
            return starter.isLeaguesHidden = !starter.isLeaguesHidden
        })
        if (tab === 'All') {
            setPlayersAll([...s])
        }
        else if (tab === 'Starters') {
            setStarters([...s])
        } else if (tab === 'Bench') {
            setBench([...s])
        } else {
            setOppPlayers([...s])
        }
    }

    const findOcurrences = (players) => {
        const playerOccurrences = []
        players.forEach(p => {
            const index = playerOccurrences.findIndex(obj => {
                return obj.id === p.id
            })
            if (index === -1) {
                playerOccurrences.push({
                    id: p.id,
                    position: p.id === '0' ? null : ['QB', 'RB', 'WR', 'TE'].includes(allPlayers[p.id].position) ? allPlayers[p.id].position : 'Other',
                    type: p.id === '0' ? null : allPlayers[p.id].years_exp === 0 ? 'R' : 'V',
                    dv: props.matchPlayer_DV(p.id),
                    count: 1,
                    leagues: [p.league],
                    isLeaguesHidden: true,
                    isPlayerHidden: false
                })
            } else {
                playerOccurrences[index].count++
                if (!playerOccurrences[index].leagues.includes(p.league)) {
                    playerOccurrences[index].leagues.push(p.league)
                }

            }
        })
        return playerOccurrences
    }

    let players_all = props.leagues.filter(x => x.userRoster.players !== null).map(league => {
        return league.userRoster.players.map(player => {
            return {
                id: player,
                league: league
            }
        })
    }).flat()

    let players = props.leagues.filter(x => x.userRoster.players !== null).map(league => {
        return league.userRoster.starters.map(starter => {
            return {
                id: starter,
                league: league
            }
        })
    }).flat()

    let bench_players = props.leagues.filter(x => x.userRoster.players !== null).map(league => {
        return league.userRoster.players.filter(x => !league.userRoster.starters.includes(x)).map(bench_player => {
            return {
                id: bench_player,
                league: league
            }
        })
    }).flat()

    let opponent_players = props.leagues.filter(x => x.matchup_opponent !== undefined).map(league => {
        return league.matchup_opponent.starters.map(starter => {
            return {
                id: starter,
                league: league
            }
        })
    }).flat()

    useEffect(() => {
        let pa = findOcurrences(players_all)
        setPlayersAll(pa)
        let s = findOcurrences(players)
        setStarters(s)
        let bp = findOcurrences(bench_players)
        setBench(bp)
        let op = findOcurrences(opponent_players)
        setOppPlayers(op)
    }, [props.leagues])

    const roster_group = tab === 'All' ? playersAll : tab === 'Starters' ? starters : tab === 'Bench' ? bench : oppPlayers

    return <>
        <div className="player_nav">
            <button className={tab === 'All' ? 'active clickable' : 'clickable'} onClick={() => setTab('All')}>All</button>
            <button className={tab === 'Starters' ? 'active clickable' : 'clickable'} onClick={() => setTab('Starters')}>Starters</button>
            <button className={tab === 'Bench' ? 'active clickable' : 'clickable'} onClick={() => setTab('Bench')}>Bench</button>
            <button className={tab === 'Opponent' ? 'active clickable' : 'clickable'} onClick={() => setTab('Opponent')}>Opponent</button>
        </div>
        {tab === 'All' ?
            <PlayerShares
                leagues={props.leagues}
                user={props.user}
                matchPlayer_DV={props.matchPlayer_DV}
                matchPick={props.matchPick}
            />
            :
            <>
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
                            <input className="clickable" name='V' onChange={(e) => filterYearsExp(e, 'Vets')} defaultChecked type="checkbox" />
                        </label>
                        <label className='script'>
                            Rookies
                            <input className="clickable" name='R' onChange={(e) => filterYearsExp(e, 'Rookies')} defaultChecked type="checkbox" />
                        </label>
                    </div>
                    <Search
                        list={roster_group.map(starter => {
                            let s = starter.id === '0' ? 'Empty' : allPlayers[starter.id].full_name
                            return s
                        })}
                        placeholder={tab === 'Starters' ? 'Search Starters' : tab === 'Bench' ? 'Search Bench Players' : 'Search Opp Starters'}
                        sendSearched={getSearched}
                    />

                </div>
                <div className="view_scrollable">
                    <table className="main">
                        <tbody className="fade_in sticky">
                            <tr>
                                <th>Count</th>
                                <th colSpan={3}>Player</th>
                                <th>Position</th>
                                <th>Team</th>
                                <th>Value</th>
                            </tr>
                        </tbody>
                        <tbody className="slide_up">
                            {roster_group.filter(x => x.id === '0').map((starter, index) =>
                                <React.Fragment key={index}>
                                    <tr onClick={() => showLeagues(starter.id)} className={starter.isLeaguesHidden ? "hover clickable" : "hover clickable active"}>
                                        <td>{starter.count}</td>
                                        <td colSpan={3}><strong>***Empty***</strong></td>
                                        <td colSpan={3}></td>
                                    </tr>
                                    {starter.isLeaguesHidden ? null :
                                        <td colSpan={7}>
                                            <LineupLeagues
                                                leagues={starter.leagues}
                                                matchPlayer_DV={props.matchPlayer_DV}
                                            />
                                        </td>
                                    }
                                </React.Fragment>
                            )}
                            {roster_group.filter(x => x.isPlayerHidden === false && x.id !== '0' && !filters.positions.includes(x.position) &&
                                !filters.types.includes(x.type)).sort((a, b) => b.count - a.count).map((starter, index) =>
                                    <React.Fragment key={index}>
                                        <tr onClick={() => showLeagues(starter.id)} className={starter.isLeaguesHidden ? "hover clickable" : "hover clickable active"}>
                                            <td>{starter.count}</td>
                                            <td>
                                                <img
                                                    style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                                    className="thumbnail"
                                                    alt="headshot"
                                                    src={starter.id === '0' ? emoji : `https://sleepercdn.com/content/nfl/players/thumb/${starter.id}.jpg`}
                                                    onError={(e) => { return e.target.src = player_default }}
                                                />
                                            </td>
                                            <td colSpan={2} className="left">{starter.id === '0' ? 'Empty' : allPlayers[starter.id].full_name}</td>
                                            <td>{starter.id === '0' ? null : allPlayers[starter.id].position}</td>
                                            <td>{starter.id === '0' ? null : allPlayers[starter.id].team === null ? 'FA' : allPlayers[starter.id].team}</td>
                                            <td>{starter.id === '0' ? null : parseInt(props.matchPlayer_DV(starter.id)).toLocaleString("en-US")}</td>
                                        </tr>
                                        {starter.isLeaguesHidden ? null :
                                            <tr>
                                                <td colSpan={7}>
                                                    <LineupLeagues
                                                        leagues={starter.leagues}
                                                        matchPlayer_DV={props.matchPlayer_DV}
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
    </>
}
export default Lineups;
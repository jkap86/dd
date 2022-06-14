import React, { useState, useMemo } from "react";
import allPlayers from '../allPlayers.json';
import player_default from '../player_default.png';
import LineupLeagues from "./lineupLeagues";
import Search from "./search";

const Lineups = (props) => {
    const [starters, setStarters] = useState([])
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
        let s = starters
        if (data) {
            s.map(starter => {
                return starter.isPlayerHidden = true
            })
            s.filter(x => x.id !== '0' && allPlayers[x.id].full_name === data).map(starter => {
                return starter.isPlayerHidden = false
            })

        } else {
            s.map(starter => {
                return starter.isPlayerHidden = false
            })
        }
        setStarters([...s])
    }

    const showLeagues = (player_id) => {
        const s = starters
        s.filter(x => x.id === player_id).map(starter => {
            return starter.isLeaguesHidden = !starter.isLeaguesHidden
        })
        setStarters([...s])
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
                playerOccurrences[index].leagues.push(p.league)
            }
        })
        return playerOccurrences
    }

    let players = props.leagues.filter(x => x.userRoster.players !== null).map(league => {
        return league.userRoster.starters.map(starter => {
            return {
                id: starter,
                league: league
            }
        })
    }).flat()

    players = useMemo(() => findOcurrences(players), [props.leagues])
    if (players !== starters) setStarters(players)
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
                    <input className="clickable" name='V' onChange={(e) => filterYearsExp(e, 'Vets')} defaultChecked type="checkbox" />
                </label>
                <label className='script'>
                    Rookies
                    <input className="clickable" name='R' onChange={(e) => filterYearsExp(e, 'Rookies')} defaultChecked type="checkbox" />
                </label>
            </div>
            <Search
                list={starters.filter(x => x.id !== '0').map(starter => allPlayers[starter.id].full_name)}
                placeholder="Search Starters"
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
                    {starters.filter(x => x.id !== '0' && x.isPlayerHidden === false && !filters.positions.includes(x.position) && 
                        !filters.types.includes(x.type)).sort((a, b) => b.count - a.count).map((starter, index) =>
                        <React.Fragment key={index}>
                            <tr onClick={() => showLeagues(starter.id)} className={starter.isLeaguesHidden ? "hover clickable" : "hover clickable active"}>
                                <td>{starter.count}</td>
                                <td>
                                    <img
                                        style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                        className="thumbnail"
                                        alt="headshot"
                                        src={`https://sleepercdn.com/content/nfl/players/thumb/${starter.id}.jpg`}
                                        onError={(e) => { return e.target.src = player_default }}
                                    />
                                </td>
                                <td colSpan={2} className="left">{allPlayers[starter.id].full_name}</td>
                                <td>{allPlayers[starter.id].position}</td>
                                <td>{allPlayers[starter.id].team === null ? 'FA' : allPlayers[starter.id].team}</td>
                                <td>{parseInt(props.matchPlayer_DV(starter.id)).toLocaleString("en-US")}</td>
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
export default Lineups;
import React, { useState, useEffect } from "react";
import League from "./league";
import emoji from '../emoji.png';
import Search from "./search";
import allPlayers from '../allPlayers.json';

const Leagues = (props) => {
    const [group_value, setGroup_value] = useState('Total')
    const [group_age, setGroup_age] = useState('All')
    const [leagues, setLeagues] = useState([])
    const [sortBy, setSortBy] = useState('index')
    const [sortToggle, setSortToggle] = useState(false)

    useEffect(() => {
        setLeagues(props.leagues.sort((a, b) => a.index - b.index))
    }, [props.leagues])

    const getValue = (league_id) => {
        let l = leagues
        l = l.find(x => x.league_id === league_id)
        let r;
        if (l.userRoster.players !== null) {
            switch (group_value) {
                case "Total":
                    r = l.userRoster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                        l.userRoster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                    break;
                case "Roster":
                    r = l.userRoster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "Picks":
                    r = l.userRoster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                    break;
                case "Starters":
                    r = l.userRoster.starters.filter(x => x !== '0').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "Bench":
                    r = l.userRoster.players.filter(x => !l.userRoster.starters.includes(x)).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "QB":
                    r = l.userRoster.players.filter(x => allPlayers[x].position === 'QB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "RB":
                    r = l.userRoster.players.filter(x => allPlayers[x].position === 'RB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "WR":
                    r = l.userRoster.players.filter(x => allPlayers[x].position === 'WR').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "TE":
                    r = l.userRoster.players.filter(x => allPlayers[x].position === 'TE').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                default:
                    r = 0
            }
        } else {
            r = 0
        }

        return r
    }

    const getAge = (league_id) => {
        let l = leagues
        l = l.find(x => x.league_id === league_id)
        let length;
        let r;
        if (l.userRoster.players !== null) {
            switch (group_age) {
                case "All":
                    r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "Starters":
                    r = l.userRoster.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = l.userRoster.starters.filter(x => x !== '0').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "Bench":
                    r = l.userRoster.players.filter(x => !l.userRoster.starters.includes(x) && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = l.userRoster.players.filter(x => !l.userRoster.starters.includes(x)).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "QB":
                    r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'QB').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'QB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "RB":
                    r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'RB').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'RB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "WR":
                    r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'WR').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'WR').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case "TE":
                    r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'TE').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'TE').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                default:
                    r = 0
                    length = 0
            }
        } else {
            r = 0
            length = 0
        }

        return length === 0 ? '-' : (r / length).toFixed(1)
    }

    const showRosters = (league_id) => {
        let l = leagues
        l.filter(x => x.league_id === league_id).map(league => {
            return league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues([...l])
    }

    const getSearched = (league_name) => {
        let l = leagues
        if (league_name) {
            l.map(league => {
                return league.isLeagueHidden = true
            })
            l.filter(x => x.name.trim() === league_name.trim()).map(league => {
                console.log(true)
                return league.isLeagueHidden = false
            })
        } else {
            l.map(league => {
                return league.isLeagueHidden = false
            })
        }
        setLeagues([...l])
    }

    const sort = (sort_by) => {
        const t = sortToggle
        const s = sortBy
        if (sort_by === s) {
            setSortToggle(!t)
        } else {
            setSortBy(sort_by)
        }

        let l = leagues
        switch (sort_by) {
            case 'League':
                l = t ? l.sort((a, b) => b.name.toLowerCase() > a.name.toLowerCase() ? 1 : -1) : l.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
                break;
            case 'Record':
                l = t ? l.sort((a, b) => a.record.winpct - b.record.winpct) : l.sort((a, b) => b.record.winpct - a.record.winpct)
                break;
            case 'Points For':
                l = t ? l.sort((a, b) => a.fpts - b.fpts) : l.sort((a, b) => b.fpts - a.fpts)
                break;
            case 'Points Against':
                l = t ? l.sort((a, b) => a.fpts_against - b.fpts_against) : l.sort((a, b) => b.fpts_against - a.fpts_against)
                break;
            case 'Value':
                l = t ? l.sort((a, b) => getValue(a.league_id) - getValue(b.league_id)) : l.sort((a, b) => getValue(b.league_id) - getValue(a.league_id))
                break;
            case 'Age':
                l = t ? l.sort((a, b) => getAge(a.league_id) > getAge(b.league_id) ? 1 : -1) : l.sort((a, b) => getAge(b.league_id) > getAge(a.league_id) ? 1 : -1)
                break;
            default:
                l = l.sort((a, b) => a.index - b.index)
                break;
        }
        setLeagues([...l])
    }

    const total_wins = leagues.filter(x => x.isLeagueHidden === false).reduce((acc, cur) => acc + cur.record.wins, 0)
    const total_losses = leagues.filter(x => x.isLeagueHidden === false).reduce((acc, cur) => acc + cur.record.losses, 0)
    const total_ties = leagues.filter(x => x.isLeagueHidden === false).reduce((acc, cur) => acc + cur.record.ties, 0)
    const win_pct = total_wins + total_losses > 0 ? total_wins / (total_wins + total_losses + total_ties) : 0

    return <>
        <div className="search_wrapper">
            <h2>{leagues.filter(x => x.isLeagueHidden === false).length} Leagues</h2>
            <h2>{total_wins}-{total_losses}{total_ties === 0 ? null : `-${total_ties}`} <em>{win_pct.toFixed(4)}</em></h2>
            <Search
                list={leagues.map(league => league.name)}
                placeholder="Search Leagues"
                sendSearched={getSearched}
            />
        </div>
        <div className="view_scrollable">
            <table className="main">
                <tbody className="fade_in sticky">
                    <tr>
                        <th colSpan={4} className="clickable" onClick={() => sort('League')}>League</th>
                        <th colSpan={2} className="clickable" onClick={() => sort('Record')}>Record</th>
                        <th colSpan={2} className="clickable" onClick={() => sort('Points For')}>PF</th>
                        <th colSpan={2} className="clickable" onClick={() => sort('Points Against')}>PA</th>
                        <th colSpan={2}>
                            <select value={group_value} onChange={(e) => setGroup_value(e.target.value)}>
                                <option>Total</option>
                                <option>Roster</option>
                                <option>Picks</option>
                                <option>Starters</option>
                                <option>Bench</option>
                                <option>QB</option>
                                <option>RB</option>
                                <option>WR</option>
                                <option>TE</option>
                            </select>
                            <p className="clickable" onClick={() => sort('Value')}>Value</p>
                        </th>
                        <th colSpan={2}>
                            <select value={group_age} onChange={(e) => setGroup_age(e.target.value)}>
                                <option>All</option>
                                <option>Starters</option>
                                <option>Bench</option>
                                <option>QB</option>
                                <option>RB</option>
                                <option>WR</option>
                                <option>TE</option>
                            </select>
                            <p className="clickable" onClick={() => sort('Age')}>
                                VWA
                            </p>
                        </th>
                    </tr>
                </tbody>
                <tbody className="slide_up">
                    {leagues.filter(x => x.isLeagueHidden === false).map((league, index) =>
                        <React.Fragment key={index}>
                            <tr
                                className={league.isRostersHidden ? 'hover clickable' : 'hover clickable active'}
                                onClick={() => showRosters(league.league_id)}
                            >
                                <td>
                                    <img
                                        style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite ease-out` }}
                                        className="thumbnail"
                                        alt="avatar"
                                        src={league.avatar === null ? emoji : `https://sleepercdn.com/avatars/${league.avatar}`}
                                    />
                                </td>
                                <td colSpan={3} className="left">{league.name}</td>
                                <td colSpan={2}>
                                    <p className="record">
                                        {`${league.record.wins}-${league.record.losses}`}
                                        {league.record.ties === 0 ? null : `-${league.record.ties}`}&nbsp;
                                    </p>
                                    <em>{league.record.winpct.toFixed(4)}</em>
                                </td>
                                <td colSpan={2}>{league.fpts}</td>
                                <td colSpan={2}>{league.fpts_against}</td>
                                <td colSpan={2}>
                                    {getValue(league.league_id).toLocaleString("en-US")}
                                </td>
                                <td colSpan={2}>
                                    {getAge(league.league_id)}
                                </td>
                            </tr>
                            {league.isRostersHidden || league.userRoster.players === null ? null :
                                <tr>
                                    <td colSpan={14}>
                                        <League
                                            league={league}
                                            matchPlayer_DV={props.matchPlayer_DV}
                                            matchPick={props.matchPick}
                                            group_value={group_value}
                                            group_age={group_age}
                                            sendGroupValue={(data) => setGroup_value(data)}
                                            sendGroupAge={(data) => setGroup_age(data)}
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
export default Leagues;
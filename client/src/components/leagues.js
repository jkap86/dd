import React, { useState } from "react";
import League from "./league";
import emoji from '../emoji.png';
import Search from "./search";
import allPlayers from '../allPlayers.json';

const Leagues = (props) => {
    const [group_value, setGroup_value] = useState('Total')
    const [group_age, setGroup_age] = useState('All')
    const [leagues, setLeagues] = useState([])
    if (leagues !== props.leagues) setLeagues(props.leagues)

    const getValue = (league_id) => {
        let l = leagues
        l = l.find(x => x.league_id === league_id)
        let r;
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
        return r
    }

    const getAge = (league_id) => {
        let l = leagues
        l = l.find(x => x.league_id === league_id)
        let length;
        let r;
        switch (group_age) {
            case "All":
                r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined).length
                break;
            case "Starters":
                r = l.userRoster.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = l.userRoster.starters.filter(x => x !== '0').length
                break;
            case "Bench":
                r = l.userRoster.players.filter(x => !l.userRoster.starters.includes(x) && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = l.userRoster.players.filter(x => !l.userRoster.starters.includes(x)).length
                break;
            case "QB":
                r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'QB').reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'QB').length
                break;
            case "RB":
                r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'RB').reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'RB').length
                break;
            case "WR":
                r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'WR').reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'WR').length
                break;
            case "TE":
                r = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'TE').reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = l.userRoster.players.filter(x => allPlayers[x].age !== undefined && allPlayers[x].position === 'TE').length
                break;
            default:
                r = 0
                length = 1
        }
        return length === 0 ? '-' : (r / length).toFixed(2)
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
            l.filter(x => x.name.trim()=== league_name.trim()).map(league => {
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
                        <th colSpan={4}>League</th>
                        <th colSpan={2}>Record</th>
                        <th colSpan={2}>Points For</th>
                        <th colSpan={2}>Points Against</th>
                        <th colSpan={2}>
                            <select onChange={(e) => setGroup_value(e.target.value)}>
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
                            Value
                        </th>
                        <th colSpan={2}>
                            <select onChange={(e) => setGroup_age(e.target.value)}>
                                <option>All</option>
                                <option>Starters</option>
                                <option>Bench</option>
                                <option>QB</option>
                                <option>RB</option>
                                <option>WR</option>
                                <option>TE</option>
                            </select>
                            Age
                        </th>
                    </tr>
                </tbody>
                <tbody className="slide_up">
                    {leagues.filter(x => x.isLeagueHidden === false).sort((a, b) => a.index - b.index).map((league, index) =>
                        <React.Fragment key={index}>
                            <tr
                                className={league.isRostersHidden ? 'hover clickable' : 'hover clickable active'}
                                onClick={() => showRosters(league.league_id)}
                            >
                                <td>
                                    <img
                                        style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
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
                                    {league.record.wins + league.record.losses === 0 ? null :
                                        <em>{(league.record.wins / (league.record.wins + league.record.losses)).toFixed(4)}</em>
                                    }
                                </td>
                                <td colSpan={2}>{league.fpts}</td>
                                <td colSpan={2}>{league.fpts_against}</td>
                                <td colSpan={2}>
                                    {league.userRoster.players === null ? null : getValue(league.league_id).toLocaleString("en-US")}
                                </td>
                                <td colSpan={2}>
                                    {league.userRoster.players === null ? null : getAge(league.league_id)}
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
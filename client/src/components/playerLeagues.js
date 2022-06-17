import React, { useState, useEffect } from "react";
import Roster from "./roster";
import emoji from '../emoji.png';
import allPlayers from '../allPlayers.json';

const PlayerLeagues = (props) => {
    const [group_value, setGroup_value] = useState('Total')
    const [group_age, setGroup_age] = useState('All')
    const [tab, setTab] = useState('Owned')
    const [leagues_owned, setLeagues_owned] = useState([])
    const [leagues_taken, setLeagues_taken] = useState([])
    const [leagues_available, setLeagues_available] = useState([])
    const [sortBy, setSortBy] = useState('index')
    const [sortToggle, setSortToggle] = useState(false)

    useEffect(() => {
        setLeagues_owned(props.leagues_owned.sort((a, b) => a.index - b.index))
        setLeagues_taken(props.leagues_taken.sort((a, b) => a.index - b.index))
        setLeagues_available(props.leagues_available.sort((a, b) => a.index - b.index))
    }, [props.leagues_owned, props.leagues_taken, props.leagues_available])

    const showRosters_owned = (league_id) => {
        const l = leagues_owned
        l.filter(x => x.league_id === league_id).map(league => {
            return league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues_owned([...l])
    }
    const showRosters_taken = (league_id) => {
        const l = leagues_taken
        l.filter(x => x.league_id === league_id).map(league => {
            return league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues_taken([...l])
    }
    const showRosters_available = (league_id) => {
        const l = leagues_available
        l.filter(x => x.league_id === league_id).map(league => {
            return league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues_available([...l])
    }

    const getValue = (league_id) => {
        let l = tab === 'Owned' ? leagues_owned : tab === 'Taken' ? leagues_taken : leagues_available
        l = l.find(x => x.league_id === league_id)
        let roster = l.userRoster
        let r;
        if (roster.players !== null) {
            switch (group_value) {
                case 'Total':
                    r = roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                        roster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                    break;
                case 'Roster':
                    r = roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'Picks':
                    r = roster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                    break;
                case 'Starters':
                    r = roster.starters.filter(x => x !== '0').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'Bench':
                    r = roster.players.filter(x => !roster.starters.includes(x)).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'QB':
                    r = roster.players.filter(x => allPlayers[x].position === 'QB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'RB':
                    r = roster.players.filter(x => allPlayers[x].position === 'RB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'WR':
                    r = roster.players.filter(x => allPlayers[x].position === 'WR').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'TE':
                    r = roster.players.filter(x => allPlayers[x].position === 'TE').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                default:
                    r = 0
                    break;
            }
        } else {
            r = 0;
        }
        return r
    }

    const getAge = (league_id) => {
        let l = tab === 'Owned' ? leagues_owned : tab === 'Taken' ? leagues_taken : leagues_available
        l = l.find(x => x.league_id === league_id)
        let roster = l.userRoster
        let length;
        let r;
        if (roster.players !== null) {
            switch (group_age) {
                case 'All':
                    r = roster.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = roster.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'Starters':
                    r = roster.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = roster.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'Bench':
                    r = roster.players.filter(x => !roster.starters.includes(x) && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = roster.players.filter(x => !roster.starters.includes(x) && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'QB':
                    r = roster.players.filter(x => allPlayers[x].position === 'QB').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = roster.players.filter(x => allPlayers[x].position === 'QB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'RB':
                    r = roster.players.filter(x => allPlayers[x].position === 'RB').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = roster.players.filter(x => allPlayers[x].position === 'RB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'WR':
                    r = roster.players.filter(x => allPlayers[x].position === 'WR').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = roster.players.filter(x => allPlayers[x].position === 'WR').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                case 'TE':
                    r = roster.players.filter(x => allPlayers[x].position === 'TE').reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                    length = roster.players.filter(x => allPlayers[x].position === 'TE').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                    break;
                default:
                    r = 0
                    length = 0
                    break;
            }
        } else {
            r = 0
            length = 0
        }
        return length === 0 ? '-' : (r / length).toFixed(1)
    }

    const sort = (sort_by) => {
        const t = sortToggle
        const s = sortBy
        if (sort_by === s) {
            setSortToggle(!t)
        } else {
            setSortBy(sort_by)
        }

        let l = tab === 'Owned' ? leagues_owned : tab === 'Taken' ? leagues_taken : leagues_available
        switch (sort_by) {
            case 'League':
                l = t ? l.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1) : l.sort((a, b) => b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1)
                break;
            case 'Record':
                l = t ? l.sort((a, b) => a.record.winpct - b.record.winpct || a.record.wins - b.record.wins || a.fpts - b.fpts)
                    : l.sort((a, b) => b.record.winpct - a.record.winpct || b.record.wins - a.record.wins || b.fpts - a.fpts)
                break;
            case 'PF':
                l = t ? l.sort((a, b) => a.fpts - b.fpts) : l.sort((a, b) => b.fpts - a.fpts)
                break;
            case 'PA':
                l = t ? l.sort((a, b) => a.fpts_against - b.fpts_against) : l.sort((a, b) => b.fpts_against - a.fpts_against)
                break;
            case 'Value':
                l = t ? l.sort((a, b) => getValue(a.league_id) - getValue(b.league_id)) : l.sort((a, b) => getValue(b.league_id) - getValue(a.league_id))
                break;
            case 'VWA':
                l = t ? l.sort((a, b) => getAge(a.league_id) - getAge(b.league_id)) : l.sort((a, b) => getAge(b.league_id) - getAge(a.league_id))
                break;
            default:
                l = l.sort((a, b) => a.index - b.index)
                break;
        }
        switch (tab) {
            case 'Owned':
                setLeagues_owned([...l])
                break;
            case 'Taken':
                setLeagues_taken([...l])
                break;
            case 'Available':
                setLeagues_available([...l])
                break;
            default:
                break;
        }
    }

    return <>
        <button className={tab === 'Owned' ? 'active clickable' : 'clickable'} onClick={() => setTab('Owned')}>Owned</button>
        <button className={tab === 'Taken' ? 'active clickable' : 'clickable'} onClick={() => setTab('Taken')}>Taken</button>
        <button className={tab === 'Available' ? 'active clickable' : 'clickable'} onClick={() => setTab('Available')}>Available</button>

        {tab !== 'Owned' ? null :
            <table className="secondary">
                <tbody className="sticky">
                    <tr>
                        <th colSpan={2} onClick={() => sort('League')}>League</th>
                        <th>Status</th>
                        <th onClick={() => sort('Record')}>Record</th>
                        <th onClick={() => sort('PF')}>PF</th>
                        <th onClick={() => sort('PA')}>PA</th>
                        <th>
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
                            <p onClick={() => sort('Value')}>Value</p>
                        </th>
                        <th>
                            <select value={group_age} onChange={(e) => setGroup_age(e.target.value)}>
                                <option>All</option>
                                <option>Starters</option>
                                <option>Bench</option>
                                <option>QB</option>
                                <option>RB</option>
                                <option>WR</option>
                                <option>TE</option>
                            </select>
                            <div className="tooltip">
                                <p onClick={() => sort('VWA')}>VWA</p>
                                <span className="tooltiptext">
                                    Value Weighted Age
                                </span>
                            </div>
                        </th>
                    </tr>
                </tbody>
                <tbody>
                    {leagues_owned.map((league, index) =>
                        <React.Fragment key={index}>
                            <tr onClick={() => showRosters_owned(league.league_id)} className={league.isRostersHidden ? 'hover2 clickable' : 'hover2 clickable active'}>
                                <td>
                                    <img
                                        style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                        className="thumbnail"
                                        alt="avatar"
                                        src={league.avatar === null ? emoji : `https://sleepercdn.com/avatars/${league.avatar}`}
                                    />
                                </td>
                                <td className="left">{league.name}</td>
                                <td>
                                    {
                                        league.userRoster.starters.includes(props.player) ? 'Starter' :
                                            league.userRoster.taxi !== null && league.userRoster.taxi.includes(props.player) ? 'Taxi' :
                                                league.userRoster.reserve !== null && league.userRoster.reserve.includes(props.player) ? 'IR'
                                                    : 'Bench'
                                    }
                                </td>
                                <td>
                                    <p className="record">
                                        {league.record.wins}-{league.record.losses}{league.record.ties === 0 ? null : `-${league.record.ties}`}
                                        &nbsp;
                                    </p>
                                    <em>{league.record.winpct.toFixed(4)}</em>
                                </td>
                                <td>{league.fpts}</td>
                                <td>{league.fpts_against}</td>
                                <td>
                                    {getValue(league.league_id).toLocaleString("en-US")}
                                </td>
                                <td>
                                    {getAge(league.league_id)}
                                </td>
                            </tr>
                            {league.isRostersHidden ? null :
                                <tr>
                                    <td colSpan={8}>
                                        <Roster
                                            roster={league.userRoster}
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
        }
        {tab !== 'Taken' ? null :
            <table className="secondary">
                <tbody>
                    <tr>
                        <th colSpan={4}>League</th>
                        <th>Manager</th>
                        <th>Record</th>
                        <th>PF</th>
                        <th>PA</th>
                        <th>
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
                            Value
                        </th>
                        <th>
                            <select value={group_age} onChange={(e) => setGroup_age(e.target.value)}>
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
                    {leagues_taken.map((league, index) =>
                        <React.Fragment key={index}>
                            <tr onClick={() => showRosters_taken(league.league_id)} className={league.isRostersHidden ? 'hover2 clickable' : 'hover2 clickable active'}>
                                <td>
                                    <img
                                        style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                        className="thumbnail"
                                        alt="avatar"
                                        src={league.avatar === null ? emoji : `https://sleepercdn.com/avatars/${league.avatar}`}
                                    />
                                </td>
                                <td colSpan={3} className="left">{league.name}</td>
                                <td>{league.rosters.find(x => x.players.includes(props.player)).username}</td>
                                <td>
                                    <p className="record">
                                        {league.record.wins}-{league.record.losses}{league.record.ties === 0 ? null : `-${league.record.ties}`}
                                        &nbsp;
                                    </p>
                                    <em>{league.record.winpct.toFixed(4)}</em>
                                </td>
                                <td>{league.fpts}</td>
                                <td>{league.fpts_against}</td>
                                <td>
                                    {getValue(league.league_id).toLocaleString("en-US")}
                                </td>
                                <td>
                                    {getAge(league.league_id)}
                                </td>
                            </tr>
                            {league.isRostersHidden ? null :
                                <tr>
                                    <td colSpan={5} className="top">
                                        <Roster
                                            roster={league.userRoster}
                                            matchPlayer_DV={props.matchPlayer_DV}
                                            matchPick={props.matchPick}
                                        />
                                    </td>
                                    <td colSpan={5} className="top">
                                        <Roster
                                            roster={league.rosters.find(x => x.players.includes(props.player))}
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
        }
        {tab !== 'Available' ? null :
            <table className="secondary">
                <tbody>
                    <tr>
                        <th colSpan={2}>League</th>
                        <th>Record</th>
                        <th>PF</th>
                        <th>PA</th>
                        <th>
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
                            Value
                        </th>
                        <th>
                            <select value={group_age} onChange={(e) => setGroup_age(e.target.value)}>
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
                    {leagues_available.map((league, index) =>
                        <React.Fragment key={index}>
                            <tr onClick={() => showRosters_available(league.league_id)} className={league.isRostersHidden ? 'hover2 clickable' : 'hover2 clickable active'}>
                                <td>
                                    <img
                                        style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                        className="thumbnail"
                                        alt="avatar"
                                        src={league.avatar === null ? emoji : `https://sleepercdn.com/avatars/${league.avatar}`}
                                    />
                                </td>
                                <td className="left">{league.name}</td>
                                <td>{league.record.wins}-{league.record.losses}{league.record.ties === 0 ? null : `-${league.record.ties}`}</td>
                                <td>{league.fpts}</td>
                                <td>{league.fpts_against}</td>
                                <td>
                                    {getValue(league.league_id).toLocaleString("en-US")}
                                </td>
                                <td>
                                    {getAge(league.league_id)}
                                </td>
                            </tr>
                            {league.isRostersHidden || league.userRoster.players === null ? null :
                                <tr>
                                    <td colSpan={7} className="top">
                                        <Roster
                                            roster={league.userRoster}
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
        }
    </>
}
export default PlayerLeagues;
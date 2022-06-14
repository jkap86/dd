import React, { useState } from "react";
import Roster from "./roster";
import emoji from '../emoji.png';

const PlayerLeagues = (props) => {
    const [tab, setTab] = useState('Owned')
    const [leagues_owned, setLeagues_owned] = useState([])
    const [leagues_taken, setLeagues_taken] = useState([])
    const [leagues_available, setLeagues_available] = useState([])
    if (props.leagues_owned !== leagues_owned) setLeagues_owned(props.leagues_owned)
    if (props.leagues_taken !== leagues_taken) setLeagues_taken(props.leagues_taken)
    if (props.leagues_available !== leagues_available) setLeagues_available(props.leagues_available)

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

    return <>
        <button className={tab === 'Owned' ? 'active clickable' : 'clickable'} onClick={() => setTab('Owned')}>Owned</button>
        <button className={tab === 'Taken' ? 'active clickable' : 'clickable'} onClick={() => setTab('Taken')}>Taken</button>
        <button className={tab === 'Available' ? 'active clickable' : 'clickable'} onClick={() => setTab('Available')}>Available</button>

        {tab !== 'Owned' ? null :
            <table className="secondary">
                <tbody>
                    <tr>
                        <th colSpan={2}>League</th>
                        <th>Status</th>
                        <th>Record</th>
                        <th>Points For</th>
                        <th>Points Against</th>
                        <th>Value</th>
                    </tr>
                    {leagues_owned.sort((a, b) => a.index - b.index).map((league, index) =>
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
                                <td>{league.record.wins}-{league.record.losses}{league.record.ties === 0 ? null : `-${league.record.ties}`}</td>
                                <td>{league.fpts}</td>
                                <td>{league.fpts_against}</td>
                                <td>
                                    {league.userRoster.players === null ?
                                        null
                                        : league.userRoster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")
                                    }
                                </td>
                            </tr>
                            {league.isRostersHidden ? null :
                                <tr>
                                    <td colSpan={7}>
                                        <Roster
                                            roster={league.userRoster}
                                            matchPlayer_DV={props.matchPlayer_DV}
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
                        <th colSpan={3}>League</th>
                        <th>Manager</th>
                        <th>Record</th>
                        <th>Points For</th>
                        <th>Points Against</th>
                        <th>Value</th>
                    </tr>
                    {leagues_taken.sort((a, b) => a.index - b.index).map((league, index) =>
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
                                <td colSpan={2} className="left">{league.name}</td>
                                <td>{league.rosters.find(x => x.players.includes(props.player)).username}</td>
                                <td>{league.record.wins}-{league.record.losses}{league.record.ties === 0 ? null : `-${league.record.ties}`}</td>
                                <td>{league.fpts}</td>
                                <td>{league.fpts_against}</td>
                                <td>
                                    {league.userRoster.players === null ?
                                        null
                                        : league.userRoster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")
                                    }
                                </td>
                            </tr>
                            {league.isRostersHidden ? null :
                                <tr>
                                    <td colSpan={4} className="top">
                                        <Roster
                                            roster={league.userRoster}
                                            matchPlayer_DV={props.matchPlayer_DV}
                                        />
                                    </td>
                                    <td colSpan={4} className="top">
                                        <Roster
                                            roster={league.rosters.find(x => x.players.includes(props.player))}
                                            matchPlayer_DV={props.matchPlayer_DV}
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
                        <th>Points For</th>
                        <th>Points Against</th>
                        <th>Value</th>
                    </tr>
                    {leagues_available.sort((a, b) => a.index - b.index).map((league, index) =>
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
                                    {league.userRoster.players === null ?
                                        null
                                        : league.userRoster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")
                                    }
                                </td>
                            </tr>
                            {league.isRostersHidden || league.userRoster.players === null ? null :
                                <tr>
                                    <td colSpan={6} className="top">
                                        <Roster
                                            roster={league.userRoster}
                                            matchPlayer_DV={props.matchPlayer_DV}
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
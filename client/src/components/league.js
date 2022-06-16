import React, { useState, useEffect } from "react";
import Roster from "./roster";
import emoji from '../emoji.png';
import allPlayers from '../allPlayers.json';

const League = (props) => {
    const [league, setLeague] = useState({})
    const [group_value, setGroup_value] = useState(props.group_value)
    const [group_age, setGroup_age] = useState(props.group_age)
    if (props.league !== league) setLeague(props.league)

    const showRoster = (roster_id) => {
        let l = league
        l.rosters.filter(x => x.roster_id === roster_id).map(roster => {
            return roster.isRosterHidden = !roster.isRosterHidden
        })
        setLeague({ ...l })
    }

    const rosters = league.rosters === undefined ? null : league.rosters.map(roster => {
        let value;
        let age;
        let length;
        switch (props.group_value) {
            case 'Total':
                value = roster.players === null ? 0 : roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                    roster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                break;
            case 'Roster':
                value = roster.players === null ? 0 : roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'Picks':
                value = roster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                break;
            case 'Starters':
                value = roster.players === null ? 0 : roster.starters.filter(x => x !== '0').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'Bench':
                value = roster.players === null ? 0 : roster.players.filter(x => !roster.starters.includes(x)).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'QB':
                value = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'QB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'RB':
                value = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'RB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'WR':
                value = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'WR').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'TE':
                value = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'TE').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            default:
                value = 0
                break;
        }
        switch (props.group_age) {
            case 'All':
                age = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].age !== undefined).length
                break;
            case 'Starters':
                age = roster.players === null ? 0 : roster.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = roster.players === null ? 0 : roster.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).length
                break;
            case 'Bench':
                age = roster.players === null ? 0 : roster.players.filter(x => !roster.starters.includes(x) && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = roster.players === null ? 0 : roster.players.filter(x => !roster.starters.includes(x) && allPlayers[x].age !== undefined).length
                break;
            case 'QB':
                age = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'QB' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'QB' && allPlayers[x].age !== undefined).length
                break;
            case 'RB':
                age = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'RB' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'RB' && allPlayers[x].age !== undefined).length
                break;
            case 'WR':
                age = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'WR' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'WR' && allPlayers[x].age !== undefined).length
                break;
            case 'TE':
                age = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'TE' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age, 0)
                length = roster.players === null ? 0 : roster.players.filter(x => allPlayers[x].position === 'TE' && allPlayers[x].age !== undefined).length
                break;
            default:
                age = 0
                length = 1
        }
        return {
            ...roster,
            value: value,
            age: length === 0 ? '-' : (age / length).toFixed(2)
        }
    })

    useEffect(() => {
        props.sendGroupValue(group_value)
    }, [group_value])

    useEffect(() => {
        setGroup_value(props.group_value)
    }, [props.group_value])

    useEffect(() => {
        props.sendGroupAge(group_age)
    }, [group_age])

    useEffect(() => {
        setGroup_age(props.group_age)
    }, [props.group_age])

    return <>
        <table className="secondary">
            <tbody>
                <tr>
                    <th colSpan={2}>Team</th>
                    <th>Record</th>
                    <th>Points For</th>
                    <th>Points Against</th>
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
                {rosters === null ? null : rosters.sort((a, b) => b.value - a.value).map((roster, index) =>
                    <React.Fragment key={index}>
                        <tr className={roster.isRosterHidden ? 'hover2 clickable' : 'hover2 clickable active'} onClick={() => showRoster(roster.roster_id)}>
                            <td>
                                <img
                                    style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                    className="thumbnail"
                                    alt="avatar"
                                    src={roster.avatar === null ? emoji : `https://sleepercdn.com/avatars/${roster.avatar}`}
                                />
                            </td>
                            <td colSpan={1} className="left">{roster.username}</td>
                            <td>{roster.wins}-{roster.losses}{roster.ties === 0 ? null : `-${roster.ties}`}</td>
                            <td>
                                {`${parseFloat(`${roster.settings.fpts}.${roster.settings.fpts_decimal === undefined ? 0 :
                                    roster.settings.fpts_decimal}`)}`}
                            </td>
                            <td>
                                {roster.settings.fpts_against === undefined ? 0 : `${parseFloat(`${roster.settings.fpts_against}.${roster.settings.fpts_against_decimal === undefined ? 0 :
                                    roster.settings.fpts_against_decimal}`)}`}
                            </td>
                            <td>{roster.value.toLocaleString("en-US")}</td>
                            <td>{roster.age}</td>
                        </tr>
                        {roster.isRosterHidden === true || roster.players === null ? null :
                            <tr>
                                <td colSpan={7}>
                                    <Roster
                                        roster={roster}
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
    </>
}
export default League;
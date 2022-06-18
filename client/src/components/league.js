import React, { useState, useEffect } from "react";
import Roster from "./roster";
import emoji from '../emoji.png';
import allPlayers from '../allPlayers.json';

const League = (props) => {
    const [rosters, setRosters] = useState([])
    const [group_value, setGroup_value] = useState(props.group_value)
    const [group_age, setGroup_age] = useState(props.group_age)
    const [sortBy, setSortBy] = useState('index')
    const [sortToggle, setSortToggle] = useState(false)

    const sort = (sort_by) => {
        const t = sortToggle
        const s = sortBy
        if (sort_by === s) {
            setSortToggle(!t)
        } else {
            setSortBy(sort_by)
        }

        let r = rosters
        switch (sort_by) {
            case 'Record':
                r = t ? r.sort((a, b) => parseFloat(a.winpct) - parseFloat(b.winpct)) : r.sort((a, b) => parseFloat(b.winpct) - parseFloat(a.winpct))
                break;
            case 'Points For':
                r = t ? r.sort((a, b) => b.settings.fpts - a.settings.fpts || b.settings.fpts_decimal - a.settings.fpts_decimal) :
                    r.sort((a, b) => a.settings.fpts - b.settings.fpts || a.settings.fpts_decimal - b.settings.fpts_decimal)
                break;
            case 'Points Against':
                r = t ? r.sort((a, b) => b.settings.fpts_against - a.settings.fpts_against || b.settings.fpts_against_decimal - a.settings.fpts_against_decimal) :
                    r.sort((a, b) => a.settings.fpts_against - b.settings.fpts_against || a.settings.fpts_against_decimal - b.settings.fpts_against_decimal)
                break;
            case 'Value':
                r = t ? r.sort((a, b) => getValue(a.roster_id) - getValue(b.roster_id)) : r.sort((a, b) => getValue(b.roster_id) - getValue(a.roster_id))
                break;
            case 'Age':
                r = t ? r.sort((a, b) => getAge(b.roster_id) - getAge(a.roster_id)) : r.sort((a, b) => getAge(a.roster_id) - getAge(b.roster_id))
                break;
            default:
                r = r.sort((a, b) => parseFloat(a.winpct) - parseFloat(b.winpct))
                break;
        }
        setRosters([...r])
    }

    const showRoster = (roster_id) => {
        let r = rosters
        r.filter(x => x.roster_id === roster_id).map(roster => {
            return roster.isRosterHidden = !roster.isRosterHidden
        })
        setRosters([...r])
    }

    const getValue = (roster_id) => {
        let r = rosters
        r = r.find(x => x.roster_id === roster_id)
        let value;
        switch (group_value) {
            case 'Total':
                value = r.players === null ? 0 : r.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                    r.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                break;
            case 'Roster':
                value = r.players === null ? 0 : r.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'Picks':
                value = r.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)
                break;
            case 'Starters':
                value = r.players === null ? 0 : r.starters.filter(x => x !== '0').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'Bench':
                value = r.players === null ? 0 : r.players.filter(x => !r.starters.includes(x)).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'QB':
                value = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'QB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'RB':
                value = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'RB').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'WR':
                value = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'WR').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'TE':
                value = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'TE').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            default:
                value = 0
                break;
        }
        return value
    }

    const getAge = (roster_id) => {
        let r = rosters
        r = r.find(x => x.roster_id === roster_id)
        let age;
        let length;
        switch (group_age) {
            case 'All':
                age = r.players === null ? 0 : r.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                length = r.players === null ? 0 : r.players.filter(x => allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'Starters':
                age = r.players === null ? 0 : r.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                length = r.players === null ? 0 : r.starters.filter(x => x !== '0' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'Bench':
                age = r.players === null ? 0 : r.players.filter(x => !r.starters.includes(x) && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                length = r.players === null ? 0 : r.players.filter(x => !r.starters.includes(x) && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'QB':
                age = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'QB' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                length = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'QB' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'RB':
                age = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'RB' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                length = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'RB' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'WR':
                age = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'WR' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                length = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'WR' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            case 'TE':
                age = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'TE' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + allPlayers[cur].age * parseInt(props.matchPlayer_DV(cur)), 0)
                length = r.players === null ? 0 : r.players.filter(x => allPlayers[x].position === 'TE' && allPlayers[x].age !== undefined).reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
                break;
            default:
                age = 0
                length = 0
        }
        return length === 0 ? '-' : (age / length).toFixed(1)
    }

    useEffect(() => {
        setRosters(props.league.rosters.sort((a, b) => parseFloat(b.winpct) - parseFloat(a.winpct)))
    }, [props.league])

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
            <tbody className="fade_in sticky">
                <tr>
                    <th className="clickable" onClick={() => sort('Team')} colSpan={2}>Team</th>
                    <th className="clickable" onClick={() => sort('Record')}>Record</th>
                    <th className="clickable" onClick={() => sort('Points For')}>PF</th>
                    <th className="clickable" onClick={() => sort('Points Against')}>PA</th>
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
                        <p className="clickable" onClick={() => sort('Value')}>
                            Value
                        </p>
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
                            <p className="clickable" onClick={() => sort('Age')}>
                                VWA
                            </p>
                            <span className="tooltiptext">
                                Value Weighted Avg Age
                            </span>
                        </div>
                    </th>
                </tr>
            </tbody>
            <tbody>
                {rosters === null ? null : rosters.map((roster, index) =>
                    <React.Fragment key={index}>
                        <tr className={roster.isRosterHidden ? 'hover2 clickable' : 'hover2 clickable active'} onClick={() => showRoster(roster.roster_id)}>
                            <td>
                                <img
                                    style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite ease-out` }}
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
                            <td>{getValue(roster.roster_id).toLocaleString("en-US")}</td>
                            <td>{getAge(roster.roster_id)}</td>
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
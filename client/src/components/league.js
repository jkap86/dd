import React, { useState } from "react";
import Roster from "./roster";
import emoji from '../emoji.png';

const League = (props) => {
    const [league, setLeague] = useState({})
    if (props.league !== league) setLeague(props.league)

    const showRoster = (roster_id) => {
        let l = league
        l.rosters.filter(x => x.roster_id === roster_id).map(roster => {
            return roster.isRosterHidden = !roster.isRosterHidden
        })
        setLeague({ ...l })
    }

    const rosters = league.rosters === undefined ? null : league.rosters.map(roster => {
        return {
            ...roster,
            value: roster.players === null ? 0 : roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0)
        }
    })

    return <>
        <table className="secondary">
            <tbody>
                <tr>
                    <th colSpan={2}>Team</th>
                    <th>Record</th>
                    <th>Points For</th>
                    <th>Points Against</th>
                    <th>Value</th>
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
                        </tr>
                        {roster.isRosterHidden === true || roster.players === null ? null :
                            <tr>
                                <td colSpan={6}>
                                    <Roster
                                        roster={roster}
                                        matchPlayer_DV={props.matchPlayer_DV}
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
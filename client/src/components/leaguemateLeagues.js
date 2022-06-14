import React, { useState } from "react";
import emoji from '../emoji.png';
import Roster from "./roster";

const LeaguemateLeagues = (props) => {
    const [leagues, setLeagues] = useState([])
    if (props.leaguemate.leagues !== leagues) setLeagues(props.leaguemate.leagues)

    const showLeagues = (league_id) => {
        const l = leagues
        l.filter(x => x.league_id === league_id).map(league => {
            return league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues([...l])
    }

    return <>
        <table className="secondary">
            <tbody>
                <tr>
                    <th colSpan={6}>{props.leaguemate.username}</th>
                    <th colSpan={4}></th>
                    <th colSpan={6}>{props.user.username}</th>
                </tr>
                <tr>
                    <th colSpan={2}>Record</th>
                    <th colSpan={2}>Fantasy Points</th>
                    <th colSpan={2}>Value</th>
                    <th colSpan={4}>League</th>
                    <th colSpan={2}>Record</th>
                    <th colSpan={2}>Fantasy Points</th>
                    <th colSpan={2}>Value</th>
                </tr>
                {leagues.sort((a, b) => a.index - b.index).map((league, index) =>
                    <React.Fragment key={index}>
                        <tr onClick={() => showLeagues(league.league_id)} className={league.isRostersHidden ? 'hover2 clickable' : 'hover2 clickable active'}>
                            <td colSpan={2}>
                                <p className="record">
                                    {league.rosters.find(x => x.username === props.leaguemate.username).wins}-
                                    {league.rosters.find(x => x.username === props.leaguemate.username).losses}
                                    {league.rosters.find(x => x.username === props.leaguemate.username).ties === 0 ? null :
                                        `-${league.rosters.find(x => x.username === props.leaguemate.username).ties} `
                                    }
                                </p>
                                {league.rosters.find(x => x.username === props.leaguemate.username).wins + league.rosters.find(x => x.username === props.leaguemate.username).losses === 0 ? null :
                                    <em> {(league.rosters.find(x => x.username === props.leaguemate.username).wins / (league.rosters.find(x => x.username === props.leaguemate.username).wins + league.rosters.find(x => x.username === props.leaguemate.username).losses)).toFixed(4)}</em>
                                }
                            </td>
                            <td colSpan={2}>
                                {league.rosters.find(x => x.username === props.leaguemate.username).fpts}-
                                {league.rosters.find(x => x.username === props.leaguemate.username).fpts_against}
                            </td>
                            <td colSpan={2}>
                                {
                                    league.rosters.find(x => x.username === props.leaguemate.username).players === null ? null :
                                        (league.rosters.find(x => x.username === props.leaguemate.username).players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                                            league.rosters.find(x => x.username === props.leaguemate.username).draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)).toLocaleString("en-US")
                                }
                            </td>
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
                                    {league.record.wins}-{league.record.losses}{league.record.ties === 0 ? null : `-${league.record.ties}`}
                                </p>
                                {league.record.wins + league.record.losses === 0 ? null :
                                    <em> {(league.record.wins / (league.record.wins + league.record.losses)).toFixed(4)}</em>
                                }
                            </td>
                            <td colSpan={2}>
                                {league.fpts}-
                                {league.fpts_against}
                            </td>
                            <td colSpan={2}>
                                {
                                    league.userRoster.players === null ? null :
                                        (league.userRoster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                                            league.userRoster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)).toLocaleString("en-US")
                                }
                            </td>
                        </tr>
                        {league.isRostersHidden === true || league.userRoster.players === null ? null :
                            <tr>
                                <td colSpan={8} className="top">
                                    <Roster
                                        roster={league.rosters.find(x => x.username === props.leaguemate.username)}
                                        matchPlayer_DV={props.matchPlayer_DV}
                                        matchPick={props.matchPick}
                                    />
                                </td>
                                <td colSpan={8} className="top">
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
    </>
}
export default LeaguemateLeagues;
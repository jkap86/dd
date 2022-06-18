import React, { useState } from "react";
import emoji from '../emoji.png';
import Breakdown from "./breakdown";

const LineupLeagues = (props) => {
    const [leagues, setLeagues] = useState([])
    if (props.leagues !== leagues) setLeagues(props.leagues)

    const showBreakdown = (league_id) => {
        let l = leagues
        l.filter(x => x.league_id === league_id).map(league => {
            return league.isRostersHidden = !league.isRostersHidden
        })
        setLeagues([...l])
    }
    console.log(leagues)
    return <>
        <table className="secondary">
            <tbody>
                <tr>
                    <th colSpan={3}>League</th>
                    <th colSpan={2}>PF</th>
                    <th colSpan={2}>PA</th>
                    <th colSpan={3}>Opponent</th>
                </tr>
                {leagues.map((league, index) =>
                    <React.Fragment key={index}>
                        <tr onClick={() => showBreakdown(league.league_id)} className={league.isRostersHidden ? "hover2 clickable" : "hover2 clickable active"}>
                            <td>
                                <img
                                    style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                    className="thumbnail"
                                    alt="avatar"
                                    src={league.avatar === null ? emoji : `https://sleepercdn.com/avatars/${league.avatar}`}
                                />
                            </td>
                            <td colSpan={2} className="left">{league.name}</td>
                            <td colSpan={2}>{league.matchup === undefined ? '-' : league.matchup.points}</td>
                            <td colSpan={2}>
                                {league.matchup_opponent === undefined ? '-' : league.matchup_opponent.points}
                            </td>
                            <td>
                                <img
                                    style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                    className="thumbnail"
                                    alt="avatar"
                                    src={league.opponent.avatar === null || league.opponent.avatar === undefined ? emoji : `https://sleepercdn.com/avatars/${league.opponent.avatar}`}
                                />
                            </td>
                            <td colSpan={2} className="left">{league.opponent.username}</td>
                        </tr>
                        {league.isRostersHidden ? null :
                            <tr>
                                <td colSpan={5} className="top">
                                    {league.matchup === undefined ? null :
                                        <Breakdown
                                            starters={league.matchup.starters}
                                            bench={league.matchup.players.filter(x => !league.matchup.starters.includes(x))}
                                            players_points={league.matchup.players_points}
                                        />
                                    }
                                </td>
                                <td colSpan={5} className="top">
                                    {league.matchup === undefined ? null :
                                        <Breakdown
                                            starters={league.matchup_opponent.starters}
                                            bench={league.matchup_opponent.players.filter(x => !league.matchup_opponent.starters.includes(x))}
                                            players_points={league.matchup_opponent.players_points}
                                        />
                                    }
                                </td>
                            </tr>

                        }
                    </React.Fragment>
                )}
            </tbody>
        </table>
    </>
}
export default LineupLeagues;
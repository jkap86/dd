import React, { useState } from "react";
import League from "./league";
import emoji from '../emoji.png';
import Search from "./search";

const Leagues = (props) => {
    const [leagues, setLeagues] = useState([])
    if (leagues !== props.leagues) setLeagues(props.leagues)
    


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
            l.filter(x => x.name === league_name).map(league => {
                return league.isLeagueHidden = false
            })
        } else {
            l.map(league => {
                return league.isLeagueHidden = false
            })
        }
        setLeagues([...l])
    }

    return <>
        <div className="search_wrapper">
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
                        <th colSpan={2}>Value</th>
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
                                    {league.userRoster.players === null ?
                                        null
                                        : (league.userRoster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                                            league.userRoster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)).toLocaleString("en-US")
                                    }
                                </td>
                            </tr>
                            {league.isRostersHidden ? null :
                                <tr>
                                    <td colSpan={12}>
                                        <League
                                            league={league}
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
        </div>
    </>
}
export default Leagues;
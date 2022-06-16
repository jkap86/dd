import React, { useState, useMemo } from "react";
import Search from "./search";
import emoji from '../emoji.png';
import LeaguemateLeagues from "./leaguemateLeagues";

const Leaguemates = (props) => {
    const [leaguemates, setLeaguemates] = useState([])

    const showLeagues = (leaguemate) => {
        const l = leaguemates
        l.filter(x => x.username === leaguemate).map(leaguemate => {
            return leaguemate.isLeaguesHidden = !leaguemate.isLeaguesHidden
        })
        setLeaguemates([...l])
    }

    const getSearched = (data) => {
        const l = leaguemates
        if (data) {
            l.map(leaguemate => {
                return leaguemate.isLeaguemateHidden = true
            })
            l.filter(x => x.username === data).map(leaguemate => {
                return leaguemate.isLeaguemateHidden = false
            })
        } else {
            l.map(leaguemate => {
                return leaguemate.isLeaguemateHidden = false
            })
        }
        setLeaguemates([...l])
    }

    const getLeaguemates = (leagues) => {
        let leaguemates = leagues.map(league => {
            return league.rosters.map(roster => {
                return {
                    ...roster,
                    index: league.index,
                    league: league,
                    wins: roster.wins,
                    losses: roster.losses,
                    ties: roster.ties,
                    user_wins: league.record.wins,
                    user_losses: league.record.losses,
                    user_ties: league.record.ties,
                    avatar: roster.avatar
                }
            })
        }).flat()

        const lmOccurrences = []
        leaguemates.forEach(lm => {
            const index = lmOccurrences.findIndex(obj => {
                return obj.id === lm.owner_id
            })
            if (index === -1) {
                lmOccurrences.push({
                    id: lm.owner_id,
                    avatar: lm.avatar,
                    user_avatar: lm.user_avatar,
                    username: lm.username,
                    count: 1,
                    leagues: [lm.league],
                    user_wins: lm.user_wins,
                    user_losses: lm.user_losses,
                    user_ties: lm.user_ties,
                    wins: lm.wins,
                    losses: lm.losses,
                    ties: lm.ties,
                    fpts: lm.fpts,
                    fpts_against: lm.fpts_against,
                    isLeaguemateHidden: false,
                    isLeaguesHidden: true
                })
            } else {
                lmOccurrences[index].count++
                lmOccurrences[index].leagues.push(lm.league)
                lmOccurrences[index].user_wins = lmOccurrences[index].user_wins + lm.user_wins
                lmOccurrences[index].user_losses = lmOccurrences[index].user_losses + lm.user_losses
                lmOccurrences[index].user_ties = lmOccurrences[index].user_ties + lm.user_ties
                lmOccurrences[index].wins = lmOccurrences[index].wins + lm.wins
                lmOccurrences[index].losses = lmOccurrences[index].losses + lm.losses 
                lmOccurrences[index].ties = lmOccurrences[index].ties + lm.ties 
                lmOccurrences[index].fpts = lmOccurrences[index].fpts + lm.fpts
                lmOccurrences[index].fpts_against = lmOccurrences[index].fpts_against + lm.fpts_against
            }
        })
        return lmOccurrences
    }

    const l = useMemo(() => getLeaguemates(props.leagues), [props.leagues])
    if (l !== leaguemates) setLeaguemates(l)


    return <>
        <div className="search_wrapper">
            <Search 
                placeholder="Search Leaguemates"
                list={leaguemates.map(leaguemate => leaguemate.username)}
                sendSearched={getSearched}
            />
        </div>
        <div className="view_scrollable">
        <table className="main">
            <tbody className="fade_in sticky">
                <tr>
                    <th colSpan={3}></th>
                    <th colSpan={3}>Leaguemate</th>
                    <th colSpan={3}>{props.user.display_name}</th>
                </tr>
                <tr>
                    <th colSpan={2}>Leaguemate</th>
                    <th>Count</th>
                    <th>Record</th>
                    <th>Points For</th>
                    <th>Points Against</th>
                    <th>Record</th>
                    <th>Points For</th>
                    <th>Points Against</th>
                </tr>
            </tbody>
            <tbody className="slide_up">
                {leaguemates.filter(x => x.isLeaguemateHidden === false).sort((a, b) => b.count - a.count).map((leaguemate, index) => 
                    <React.Fragment key={index}>
                        <tr onClick={() => showLeagues(leaguemate.username)} className={leaguemate.isLeaguesHidden ? 'hover clickable' : 'hover clickable active'}>
                            <td>
                                <img 
                                    style={{ animation: `rotation ${Math.random() * 10 + 2}s infinite linear` }}
                                    className="thumbnail"
                                    alt="avatar"
                                    src={leaguemate.avatar === null ? emoji : `https://sleepercdn.com/avatars/${leaguemate.avatar}`}
                                />
                            </td>
                            <td className="left">{leaguemate.username}</td>
                            <td>{leaguemate.count}</td>
                            <td>
                                {leaguemate.wins}-{leaguemate.losses}{leaguemate.ties === 0 ? null : `-${leaguemate.ties}`} {leaguemate.wins + leaguemate.losses === 0 ? null : 
                                    <em>{(leaguemate.wins/(leaguemate.wins + leaguemate.losses)).toFixed(4)}</em>
                                }    
                            </td>
                            <td>{leaguemate.fpts}</td>
                            <td>{leaguemate.fpts_against}</td>
                            <td>
                                {leaguemate.user_wins}-{leaguemate.user_losses}{leaguemate.user_ties === 0 ? null : `-${leaguemate.user_ties}`} {leaguemate.user_wins + leaguemate.user_losses + leaguemate.user_losses === 0 ? null : 
                                    <em>{(leaguemate.user_wins/(leaguemate.user_wins + leaguemate.user_losses + leaguemate.user_ties)).toFixed(4)}</em>
                                }    
                            </td>
                            <td>{leaguemate.fpts}</td>
                            <td>{leaguemate.fpts_against}</td>
                        </tr>
                        {leaguemate.isLeaguesHidden ? null : 
                            <tr>
                                <td colSpan={9}>
                                    <LeaguemateLeagues 
                                        leaguemate={leaguemate}
                                        user={props.user}
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
export default Leaguemates;
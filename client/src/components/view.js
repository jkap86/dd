import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import SliderToggle from "./sliderToggle";
import Leagues from "./leagues";
import PlayerShares from "./playerShares";
import allPlayers from '../allPlayers.json';
import Leaguemates from "./leaguemates";
import Lineups from "./lineups";

const View = () => {
    const params = useParams()
    const [dv, setDv] = useState([])
    const [user, setUser] = useState({})
    const [leagues, setLeagues] = useState([])
    const [activeTab, setActiveTab] = useState('Leagues')
    const [filters, setFilters] = useState({ 'r_d': 'All', 'b_s': 'All' })

    useEffect(() => {
        const fetchData = async () => {
            const dv = await axios.get('/dynastyvalues')
            setDv(dv.data)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const u = await axios.get('/user', {
                params: {
                    username: params.username
                }
            })
            setUser(u.data)
            const l = await axios.get('/leagues', {
                params: {
                    username: params.username
                }
            })
            console.log(l.data.sort((a, b) => a.index - b.index))
            setLeagues(l.data)
        }
        fetchData()
    }, [params.username])

    const matchPlayer_DV = (player) => {
        if (player === '0') {
            return null
        } else {
            if (dv.find(x => x.searchName === allPlayers[player].search_full_name)) {
                return dv.find(x => x.searchName === allPlayers[player].search_full_name).value
            } else if (dv.find(x => allPlayers[player].search_full_name !== undefined && x.searchName.slice(-5, -2) === allPlayers[player].search_full_name.slice(-5, -2) && x.searchName.slice(0, 3) === allPlayers[player].search_full_name.slice(0, 3))) {
                return dv.find(x => x.searchName.slice(-5, -2) === allPlayers[player].search_full_name.slice(-5, -2) && x.searchName.slice(0, 3) === allPlayers[player].search_full_name.slice(0, 3)).value
            } else {
                return 0
            }
        }
    }
    const matchPick = (season, round) => {
        let value = dv.find(x => `${season}mid${round}` === x.searchName.slice(0, 8))

        value = value === undefined ? 0 : value.value
        return value
    }

    const getSelection = (data) => {
        const key = Object.keys(data)[0]
        let f = { ...filters, [key]: data[key] }
        setFilters(f)
        let l = leagues
        l.map(league => {
            league.isLeagueTypeHidden = true;
            if (f.rd === 'All' && f.b_s === 'All') {
                league.isLeagueTypeHidden = false
            } else if ((f.r_d === league.dynasty || f.r_d === 'All') && (f.b_s === league.bestball || f.b_s === 'All')) {
                league.isLeagueTypeHidden = false
            }
        })
        setLeagues([...l])
    }


    return <>
        <div className="nav">
            <Link to="/" className="link clickable">Home</Link>
            <h1>Dynasty Dashboard</h1>
            <h2>{user.display_name}</h2>
            <div className="nav_container">
                <button onClick={() => setActiveTab('Leagues')} className={activeTab === 'Leagues' ? 'active nav clickable' : 'nav clickable'}>Leagues</button>
                <button onClick={() => setActiveTab('Players')} className={activeTab === 'Players' ? 'active nav clickable' : 'nav clickable'}>Players</button>
                <button onClick={() => setActiveTab('Leaguemates')} className={activeTab === 'Leaguemates' ? 'active nav clickable' : 'nav clickable'}>Leaguemates</button>
                <button onClick={() => setActiveTab('Lineups')} className={activeTab === 'Lineups' ? 'active nav clickable' : 'nav clickable'}>Lineups</button>
            </div>
            <div className="slidercontainer">
                <SliderToggle
                    sendSelection={getSelection}
                    className="slidertoggle"
                    name="r_d"
                    names={['Redraft', 'All', 'Dynasty']}
                    active="All"
                />
                <SliderToggle
                    sendSelection={getSelection}
                    className="slidertoggle"
                    name="b_s"
                    names={['BestBall', 'All', 'Standard']}
                    active="All"
                />
            </div>
        </div>
        {activeTab === 'Leagues' ?
            leagues.length > 0 ?
                <Leagues
                    leagues={leagues.filter(x => x.isLeagueTypeHidden === false)}
                    matchPlayer_DV={matchPlayer_DV}
                    matchPick={matchPick}
                />
                : <h1>Loading...</h1>
            : null
        }
        {activeTab === 'Players' ?
            leagues.length > 0 ?
                <PlayerShares
                    leagues={leagues.filter(x => x.isLeagueTypeHidden === false)}
                    user={user}
                    matchPlayer_DV={matchPlayer_DV}
                    matchPick={matchPick}
                />
                : <h1>Loading...</h1>
            : null
        }
        {activeTab === 'Leaguemates' ?
            leagues.length > 0 ?
                <Leaguemates
                    leagues={leagues.filter(x => x.isLeagueTypeHidden === false)}
                    user={user}
                    matchPlayer_DV={matchPlayer_DV}
                    matchPick={matchPick}
                />
                : <h1>Loading...</h1>
            : null
        }
        {activeTab === 'Lineups' ?
            leagues.length > 0 ?
                <Lineups
                    leagues={leagues.filter(x => x.isLeagueTypeHidden === false)}
                    matchPlayer_DV={matchPlayer_DV}
                    matchPick={matchPick}
                />
                : <h1>Loading...</h1>
            : null
        }
    </>
}

export default View;
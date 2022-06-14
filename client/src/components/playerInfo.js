import { useEffect, useState } from "react";
import axios from "axios";
import allPlayers from '../allPlayers.json';
import player_default from '../player_default.png';
import Search from "./search";

const PlayerInfo = (props) => {
    const [dv, setDv] = useState([])
    const [filters, setFilters] = useState({ positions: [], types: [] })

    const filterPosition = (e) => {
        let f = filters.positions
        if (e.target.checked) {
            const index = f.indexOf(e.target.name)
            f.splice(index, 1)
        } else {
            f.push(e.target.name)
        }
        setFilters({ ...filters, positions: f })
    }

    const getSearched = (data) => {
        const p = dv
        if (data) {
            p.map(player => {
                return player.isPlayerHidden = true
            })
            p.filter(x => data === x.name)
                .map(player => {
                    return player.isPlayerHidden = false
                })
        } else {
            p.map(player => {
                return player.isPlayerHidden = false
            })
        }
        setDv([...p])
    }

    const updateValue = (name, team, position, updated_value) => {
        const d = dv
        d.filter(x => x.name === name && x.team === team && x.position === position).map(player => {
            return player.updated_value = updated_value
        })
        setDv([...d])
    }

    useEffect(() => {
        props.sendDV(dv)
    }, [dv])

    useEffect(() => {
        const fetchData = async () => {
            const dv = await axios.get('/dynastyvalues')
            dv.data.map(player => {
                if (Object.keys(allPlayers).find(x => allPlayers[x].search_full_name === player.searchName && allPlayers[x].position === player.position)) {
                    return player.id = Object.keys(allPlayers).find(x => allPlayers[x].search_full_name === player.searchName && allPlayers[x].position === player.position)
                } else if (Object.keys(allPlayers).find(x => allPlayers[x].search_full_name !== undefined && allPlayers[x].search_full_name.slice(-5, -2) === player.searchName.slice(-5, -2) && allPlayers[x].search_full_name.slice(0, 3) === player.searchName.slice(0, 3))) {
                    return player.id = Object.keys(allPlayers).find(x => allPlayers[x].search_full_name.slice(-5, -2) === player.searchName.slice(-5, -2) && allPlayers[x].search_full_name.slice(0, 3) === player.searchName.slice(0, 3))
                }
            })
            setDv(dv.data)
        }
        fetchData()
    }, [])

    return <>
        <div className="search_wrapper">
            <div className="checkboxes">
                <label className="script">
                    QB
                    <input className="clickable" name="QB" onClick={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    RB
                    <input className="clickable" name="RB" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    WR
                    <input className="clickable" name="WR" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    TE
                    <input className="clickable" name="TE" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    Other
                    <input className="clickable" name="Other" onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
                <label className='script'>
                    Picks
                    <input className="clickable" name='PI' onChange={filterPosition} defaultChecked type="checkbox" />
                </label>
            </div>
            <Search
                list={dv.map(player => player.name)}
                placeholder="Search Players/Picks"
                sendSearched={getSearched}
            />
        </div>
        <div className="view_scrollable">
            <table className="main">
                <tbody>
                    <tr>
                        <th colSpan={2}>Player</th>
                        <th>Position</th>
                        <th>Team</th>
                        <th>KTC Value</th>
                        <th>User Value</th>
                    </tr>
                    {dv.filter(x => x.isPlayerHidden === false && !filters.positions.includes(x.position) && !filters.types.includes(x.type)).map((player, index) =>
                        <tr className="hover" key={index}>
                            <td>
                                <img
                                    className="thumbnail"
                                    alt="headshot"
                                    src={`https://sleepercdn.com/content/nfl/players/thumb/${player.id}.jpg`}
                                    onError={(e) => { return e.target.src = player_default }}
                                />
                            </td>
                            <td>{player.name}</td>
                            <td>{player.position}</td>
                            <td>{player.team}</td>
                            <td>{player.value}</td>
                            <td>
                                <input
                                    type="text"
                                    className={parseInt(player.updated_value) === parseInt(player.value) ? 'updated_value' : 'updated_value modified'}
                                    value={player.updated_value}
                                    onChange={(e) => updateValue(player.name, player.team, player.position, e.target.value)}
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
}
export default PlayerInfo;
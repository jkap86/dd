import { useEffect, useState } from "react";
import axios from "axios";
import allPlayers from '../allPlayers.json';
import player_default from '../player_default.png';

const PlayerInfo = (props) => {
    const [dv, setDv] = useState([])

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
                }
            })
            setDv(dv.data)
        }
        fetchData()
    }, [])

    return <>
        <table className="main">
            <tbody>
                <tr>
                    <th colSpan={2}>Player</th>
                    <th>Position</th>
                    <th>Team</th>
                    <th>KTC Value</th>
                    <th>User Value</th>
                </tr>
                {dv.map((player, index) => 
                    <tr key={index}>
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
    </>
}
export default PlayerInfo;
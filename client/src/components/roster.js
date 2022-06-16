import allPlayers from '../allPlayers.json';
import { useState } from 'react';


const Roster = (props) => {
    const [tab, setTab] = useState('Lineup')
    
    return <>
        <table className='tertiary'>
            <caption>
                <button className={tab === 'Lineup' ? 'active clickable' : 'clickable'} onClick={() => setTab('Lineup')}>Lineup</button>
                <button className={tab === 'Positions' ? 'active clickable' : 'clickable'} onClick={() => setTab('Positions')}>Positions</button>
                <button className={tab === 'Picks' ? 'active clickable' : 'clickable'} onClick={() => setTab('Picks')}>Picks</button>
            </caption>
            <tbody>
                <tr>
                    <th>{props.roster.username}</th>
                </tr>
                <tr>
                    <th>
                        {(props.roster.players.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0) +
                            props.roster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0)).toLocaleString("en-US")}
                    </th>
                </tr>
                <tr>
                    <td className='flex top'>
                        {props.roster.players === null ? null :
                            <>
                                {tab === 'Lineup' ?
                                    <>
                                        <table className='rostercolumn'>
                                            <tbody>
                                                <tr>
                                                    <th>Starters</th>
                                                    <th>
                                                        {props.roster.starters.filter(x => x !== '0').reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")}
                                                    </th>
                                                </tr>
                                                {props.roster.starters.map((player, index) =>
                                                    <tr key={index}>
                                                        <td className='left'>
                                                            {
                                                                player === '0' ? <span>empty</span> : allPlayers[player].position +
                                                                    " " + allPlayers[player].full_name + ` ${allPlayers[player].team === null ? 'FA' : allPlayers[player].team}`
                                                            }
                                                        </td>
                                                        <td className='black'>
                                                            <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                {props.matchPlayer_DV(player)}
                                                            </em>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <table className='rostercolumn'>
                                            <tbody>
                                                <tr>
                                                    <th>Bench</th>
                                                    <th>
                                                        {props.roster.players.filter(x => !props.roster.starters.includes(x) && (props.roster.taxi === null ||
                                                            !props.roster.taxi.includes(x)) && (props.roster.reserve === null ||
                                                                !props.roster.reserve.includes(x))).reduce((acc, cur) =>
                                                                    acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")}
                                                    </th>
                                                </tr>
                                                {props.roster.players.filter(x => !props.roster.starters.includes(x) && (props.roster.taxi === null ||
                                                    !props.roster.taxi.includes(x)) && (props.roster.reserve === null ||
                                                        !props.roster.reserve.includes(x))).sort((a, b) => props.matchPlayer_DV(b) - props.matchPlayer_DV(a))
                                                    .map((player, index) =>
                                                        <tr key={index}>
                                                            <td className='left'>
                                                                {`${allPlayers[player].position} ${allPlayers[player].full_name}`}
                                                            </td>
                                                            <td className='black'>
                                                                <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                    {props.matchPlayer_DV(player)}
                                                                </em>
                                                            </td>
                                                        </tr>
                                                    )}
                                            </tbody>
                                        </table>
                                        {props.roster.taxi === null ? null :
                                            <table className='rostercolumn'>
                                                <tbody>
                                                    <tr>
                                                        <th>Taxi</th>
                                                        <th>
                                                            {props.roster.taxi.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")}
                                                        </th>
                                                    </tr>
                                                    {props.roster.taxi.map((player, index) =>
                                                        <tr key={index}>
                                                            <td className='left'>
                                                                {`${allPlayers[player].position} ${allPlayers[player].full_name}`}
                                                            </td>
                                                            <td className='black'>
                                                                <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                    {props.matchPlayer_DV(player)}
                                                                </em>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        }
                                        {props.roster.reserve === null ? null :
                                            <table className='rostercolumn'>
                                                <tbody>
                                                    <tr>
                                                        <th>IR</th>
                                                        <th>
                                                            {props.roster.reserve.reduce((acc, cur) => acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")}
                                                        </th>
                                                    </tr>
                                                    {props.roster.reserve.map((player, index) =>
                                                        <tr key={index}>
                                                            <td className='left'>
                                                                {`${allPlayers[player].position} ${allPlayers[player].full_name}`}
                                                            </td>
                                                            <td className='black'>
                                                                <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                    {props.matchPlayer_DV(player)}
                                                                </em>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        }
                                    </>
                                    : null
                                }
                                {tab === 'Positions' ?
                                    <>
                                        <table className='rostercolumn'>
                                            <tbody>
                                                <tr>
                                                    <th>QB</th>
                                                    <th>
                                                        {
                                                            props.roster.players.filter(x => allPlayers[x].position === 'QB').reduce((acc, cur) =>
                                                                acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")
                                                        }
                                                    </th>
                                                </tr>
                                                {props.roster.players.filter(x => allPlayers[x].position === 'QB').sort((a, b) => props.matchPlayer_DV(b) - props.matchPlayer_DV(a)).map((player, index) =>
                                                    <tr key={index}>
                                                        <td className='left'>
                                                            {`${allPlayers[player].position} ${allPlayers[player].full_name}`}
                                                        </td>
                                                        <td className='black'>
                                                            <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                {props.matchPlayer_DV(player)}
                                                            </em>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <table className='rostercolumn'>
                                            <tbody>
                                                <tr>
                                                    <th>RB</th>
                                                    <th>
                                                        {
                                                            props.roster.players.filter(x => allPlayers[x].position === 'RB').reduce((acc, cur) =>
                                                                acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")
                                                        }
                                                    </th>
                                                </tr>
                                                {props.roster.players.filter(x => allPlayers[x].position === 'RB').sort((a, b) => props.matchPlayer_DV(b) - props.matchPlayer_DV(a)).map((player, index) =>
                                                    <tr key={index}>
                                                        <td className='left'>
                                                            {`${allPlayers[player].position} ${allPlayers[player].full_name}`}
                                                        </td>
                                                        <td className='black'>
                                                            <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                {props.matchPlayer_DV(player)}
                                                            </em>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <table className='rostercolumn'>
                                            <tbody>
                                                <tr>
                                                    <th>WR</th>
                                                    <th>
                                                        {
                                                            props.roster.players.filter(x => allPlayers[x].position === 'WR').reduce((acc, cur) =>
                                                                acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")
                                                        }
                                                    </th>
                                                </tr>
                                                {props.roster.players.filter(x => allPlayers[x].position === 'WR').sort((a, b) => props.matchPlayer_DV(b) - props.matchPlayer_DV(a)).map((player, index) =>
                                                    <tr key={index}>
                                                        <td className='left'>
                                                            {`${allPlayers[player].position} ${allPlayers[player].full_name}`}
                                                        </td>
                                                        <td className='black'>
                                                            <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                {props.matchPlayer_DV(player)}
                                                            </em>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <table className='rostercolumn'>
                                            <tbody>
                                                <tr>
                                                    <th>TE</th>
                                                    <th>
                                                        {
                                                            props.roster.players.filter(x => allPlayers[x].position === 'TE').reduce((acc, cur) =>
                                                                acc + parseInt(props.matchPlayer_DV(cur)), 0).toLocaleString("en-US")
                                                        }
                                                    </th>
                                                </tr>
                                                {props.roster.players.filter(x => allPlayers[x].position === 'TE').sort((a, b) => props.matchPlayer_DV(b) - props.matchPlayer_DV(a)).map((player, index) =>
                                                    <tr key={index}>
                                                        <td className='left'>
                                                            {`${allPlayers[player].position} ${allPlayers[player].full_name}`}
                                                        </td>
                                                        <td className='black'>
                                                            <em style={{ filter: `invert(${(props.matchPlayer_DV(player) / 200) + 50}%) brightness(2)` }}>
                                                                {props.matchPlayer_DV(player)}
                                                            </em>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </>
                                    : null
                                }
                                {tab === 'Picks' ?
                                    <table className='rostercolumn'>
                                        <tbody>
                                            <tr>
                                                <th>Draft Picks</th>
                                                <th>{props.roster.draft_picks.reduce((acc, cur) => acc + parseInt(props.matchPick(cur.season, cur.round)), 0).toLocaleString("en-US")}</th>
                                            </tr>
                                            {props.roster.draft_picks.sort((a, b) => a.season - b.season || a.round - b.round).map((pick, index) =>
                                                <tr key={index}>
                                                    <td>{pick.season} Round {pick.round}</td>
                                                    <td className='black'>
                                                        <em style={{ filter: `invert(${(props.matchPick(pick.season, pick.round) / 200) + 50}%) brightness(2)` }}>
                                                            {props.matchPick(pick.season, pick.round)}
                                                        </em>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    : null
                                }
                            </>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    </>
}
export default Roster;
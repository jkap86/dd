import allPlayers from '../allPlayers.json';

const Breakdown = (props) => {

    return <>
        <table className="tertiary">
            <tbody>
                <tr>
                    <th>Player</th>
                    <th>Points</th>
                </tr>
                {props.starters.map((starter, index) => 
                    <tr key={index}>
                        <td className='left'>{starter === '0' ? <em>empty</em> : allPlayers[starter].full_name}</td>
                        <td>{starter === '0' ? null : props.players_points[starter]}</td>
                    </tr>    
                )}
            </tbody>
        </table>
    </>
}
export default Breakdown;
import { useEffect, useState } from "react";
import allPlayers from '../allPlayers.json';
import Search from "./search";

const Transactions = (props) => {
    const [manager1, setManager1] = useState(null)
    const [player, setPlayer] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [page, SetPage] = useState(1)
    const [filters, setFilters] = useState({ types: [] })

    useEffect(() => {
        setTransactions(props.transactions.sort((a, b) => b.status_updated - a.status_updated))
    }, [props.transactions])

    const getSearched = (data, type) => {
        let t = transactions
        if (type === 'M') {
            if (list_managers.includes(data)) {
                t.map(trans => {
                    return trans.isTransactionHidden = true
                })
                if (player !== null) {
                    t.filter(x => x.users.find(y => y.username === data) !== undefined &&
                        (x.adds !== null && Object.keys(x.adds).find(y => allPlayers[y].full_name === player) !== undefined) ||
                        (x.drops !== null && Object.keys(x.drops).find(y => allPlayers[y].full_name === player) !== undefined)
                    ).map(trans => {
                        return trans.isTransactionHidden = false
                    })
                } else {
                    t.filter(x => x.users.find(y => y.username === data) !== undefined).map(trans => {
                        return trans.isTransactionHidden = false
                    })
                }
            } else {
                if (player !== null) {
                    t.map(trans => {
                        return trans.isTransactionHidden = true
                    })
                    t.filter(x =>
                        (x.adds !== null && Object.keys(x.adds).find(y => allPlayers[y].full_name === player) !== undefined) ||
                        (x.drops !== null && Object.keys(x.drops).find(y => allPlayers[y].full_name === player) !== undefined)
                    ).map(trans => {
                        return trans.isTransactionHidden = false
                    })
                } else {
                    t.map(trans => {
                        return trans.isTransactionHidden = false
                    })
                }
            }
            setManager1(data)
        } else if (type === 'P') {
            if (list_players.includes(data)) {
                t.map(trans => {
                    return trans.isTransactionHidden = true
                })
                if (manager1 !== null) {
                    t.filter(x => x.users.find(y => y.username === manager1) !== undefined && (
                        (x.adds !== null && Object.keys(x.adds).find(y => allPlayers[y].full_name === data) !== undefined) ||
                        (x.drops !== null && Object.keys(x.drops).find(y => allPlayers[y].full_name === data) !== undefined)
                    )).map(trans => {
                        return trans.isTransactionHidden = false
                    })
                } else {
                    t.filter(x =>
                        (x.adds !== null && Object.keys(x.adds).find(y => allPlayers[y].full_name === data) !== undefined) ||
                        (x.drops !== null && Object.keys(x.drops).find(y => allPlayers[y].full_name === data) !== undefined)
                    ).map(trans => {
                        return trans.isTransactionHidden = false
                    })
                }
            } else {
                if (manager1 !== null) {
                    t.map(trans => {
                        return trans.isTransactionHidden = true
                    })
                    t.filter(x => x.users.find(y => y.username === manager1) !== undefined).map(trans => {
                        return trans.isTransactionHidden = false
                    })
                } else {
                    t.map(trans => {
                        return trans.isTransactionHidden = false
                    })
                }
            }
            setPlayer(data)
        }
        setTransactions([...t])
    }

    const filterType = (e, type) => {
        let f = filters.types
        if (e.target.checked) {
            const index = f.indexOf(type)
            f.splice(index, 1)
        } else {
            f.push(type)
        }
        setFilters({ ...filters, types: [...f] })
    }

    let list_managers = transactions.filter(x => x.isTransactionHidden === false).map(transaction => {
        return transaction.users.map(user => {
            return user.username
        })
    }).flat(2)

    list_managers = Array.from(new Set(list_managers))

    let adds = transactions.filter(x => x.isTransactionHidden === false && x.adds !== null).map(transaction => {
        return Object.keys(transaction.adds).map(player => {
            return allPlayers[player].full_name
        })
    }).flat()

    let drops = transactions.filter(x => x.isTransactionHidden === false && x.drops !== null).map(transaction => {
        return Object.keys(transaction.drops).map(player => {
            return allPlayers[player].full_name
        })
    }).flat()

    let list_players = Array.from(new Set([...adds, ...drops].flat()))



    return <>

        <div className="search_wrapper">
            <div className="checkboxes">
                <label className="script">
                    Free Agent
                    <input className="clickable" onChange={(e) => filterType(e, 'free_agent')} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    Waiver
                    <input className="clickable" onChange={(e) => filterType(e, 'waiver')} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    Trade
                    <input className="clickable" onChange={(e) => filterType(e, 'trade')} defaultChecked type="checkbox" />
                </label>
                <label className="script">
                    Commish
                    <input className="clickable" onChange={(e) => filterType(e, 'commissioner')} defaultChecked type="checkbox" />
                </label>
            </div>
            <Search
                list={list_managers}
                placeholder="Manager"
                sendSearched={(data) => getSearched(data, 'M')}
                value={props.user.display_name}
            />
            <Search
                list={list_players}
                placeholder="Players"
                sendSearched={(data) => getSearched(data, 'P')}
                value={null}
            />
            <ol className="page_numbers">
                {Array.from(Array(Math.ceil(transactions.filter(x => x.isTransactionHidden === false).length / 50)).keys()).map(key => key + 1).map(page_number =>
                    <li key={page_number} onClick={() => SetPage(page_number)}>
                        {page_number}
                    </li>
                )}
            </ol>
        </div>

        <table className="main">
            <tbody>
                <tr>
                    <th colSpan={2}>Date</th>
                    <th colSpan={2}>League</th>
                    <th>Type</th>
                    <th colSpan={2}></th>
                </tr>
            </tbody>
            <tbody>
                {transactions.filter(x => x.isTransactionHidden === false && !filters.types.includes(x.type)).slice((page - 1) * 50, ((page - 1) * 50) + 50).map((transaction, index) =>
                    <tr key={index}>
                        <td colSpan={2}>{new Date(transaction.status_updated).toLocaleString()}</td>
                        <td colSpan={2}>{transaction.league_name}</td>
                        <td>{transaction.type.replace('_', ' ')}</td>
                        <td colSpan={2}>
                            <div className="transaction">
                                {transaction.users.map((user, index) =>
                                    <div className="transaction_user" key={index}>
                                        <p className="header_user">
                                            {user.username}
                                        </p>
                                        {transaction.adds === null ? null : Object.keys(transaction.adds)
                                            .filter(x => transaction.adds[x] === user.roster_id).map((player, index) =>
                                                <p className="green" key={index}>
                                                    + {allPlayers[player].full_name}
                                                </p>
                                            )
                                        }
                                        {transaction.draft_picks.filter(x => x.owner_id === user.roster_id).map((pick, index) =>
                                            <p className="green" key={index}>
                                                + {`${pick.season} Round ${pick.round} (${pick.original_username})`}
                                            </p>
                                        )}
                                        {transaction.drops === null ? null : Object.keys(transaction.drops)
                                            .filter(x => transaction.drops[x] === user.roster_id).map((player, index) =>
                                                <p className="red" key={index}>
                                                    - {allPlayers[player].full_name}
                                                </p>
                                            )
                                        }
                                        {transaction.draft_picks.filter(x => x.previous_owner_id === user.roster_id).map((pick, index) =>
                                            <p className="red" key={index}>
                                                - {`${pick.season} Round ${pick.round} (${pick.original_username})`}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </>
}
export default Transactions;
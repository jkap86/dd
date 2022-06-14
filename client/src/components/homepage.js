import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

const Homepage = () => {
    const [username, setUsername] = useState('')

    const getUser = async (e) => {
        const user = await axios.get('/user', {
            params: {
                username: e.target.value
            }
        })
        if (typeof (user.data) === 'object') {
            setUsername(user.data.display_name)
        } else {
            setUsername('')
        }
    }

    return <>
        <h1>Dynasty Dashboard</h1>
        <br /><br />
        <div className="search_wrapper">
            <input 
                className="home_search"
                type="text"
                placeholder="username"
                onChange={getUser}
            />
            <br /><br />
            {
                username === '' ? null : 
                <Link to={`/${username}`}>
                    <button className="home clickable" type="submit">Submit</button>
                </Link>
            }
        </div>
    </>
}

export default Homepage;
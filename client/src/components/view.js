import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import SliderToggle from "./sliderToggle";
import Leagues from "./leagues";
import allPlayers from "../allPlayers.json";
import Leaguemates from "./leaguemates";
import Lineups from "./lineups";
import PlayerInfo from "./playerInfo";
import emoji from "../emoji.png";
import Transactions from "./transactions";

const View = () => {
  const params = useParams();
  const [dv, setDv] = useState([]);
  const [user, setUser] = useState({});
  const [leagues, setLeagues] = useState([]);
  const [transactions, setTransactions] = useState([])
  const [activeTab, setActiveTab] = useState("Leagues");
  const [filters, setFilters] = useState({ r_d: "All", b_s: "All" });



  useEffect(() => {
    const fetchData = async () => {
      const u = await axios.get("/user", {
        params: {
          username: params.username,
        },
      });
      setUser(u.data);
      const l = await axios.get("/leagues", {
        params: {
          username: params.username,
        },
      });
      setLeagues(l.data);
      const t = await axios.get('/transactions', {
        params: {
          username: params.username
        }
      })
      setTransactions(t.data)
    };
    fetchData();
  }, [params.username]);


  const matchPlayer_DV = (player) => {
    if (player === "0") {
      return null;
    } else {
      if (
        dv.find((x) => x.searchName === allPlayers[player].search_full_name)
      ) {
        return dv.find(
          (x) => x.searchName === allPlayers[player].search_full_name
        ).updated_value;
      } else if (
        dv.find(
          (x) =>
            allPlayers[player].search_full_name !== undefined &&
            x.searchName.slice(-5, -2) ===
            allPlayers[player].search_full_name.slice(-5, -2) &&
            x.searchName.slice(0, 3) ===
            allPlayers[player].search_full_name.slice(0, 3)
        )
      ) {
        return dv.find(
          (x) =>
            x.searchName.slice(-5, -2) ===
            allPlayers[player].search_full_name.slice(-5, -2) &&
            x.searchName.slice(0, 3) ===
            allPlayers[player].search_full_name.slice(0, 3)
        ).updated_value;
      } else {
        return 0;
      }
    }
  };

  const matchPick = (season, round) => {
    let value = dv.find(
      (x) => `${season}mid${round}` === x.searchName.slice(0, 8)
    );

    value = value === undefined ? 0 : value.value;
    return value;
  };

  const getSelection = (data) => {
    const key = Object.keys(data)[0];
    let f = { ...filters, [key]: data[key] };
    setFilters(f);
    let l = leagues;
    l.map((league) => {
      league.isLeagueTypeHidden = true;
      if (f.rd === "All" && f.b_s === "All") {
        league.isLeagueTypeHidden = false;
      } else if (
        (f.r_d === league.dynasty || f.r_d === "All") &&
        (f.b_s === league.bestball || f.b_s === "All")
      ) {
        league.isLeagueTypeHidden = false;
      }
    });
    setLeagues([...l]);
  };

  return (
    <>
      <div className="nav">
        <Link to="/" className="link clickable">
          Home
        </Link>
        <button
          className={
            activeTab === "All Players" ? "allplayers active" : "allplayers"
          }
          onClick={() => setActiveTab("All Players")}
        >
          Dynasty Values
        </button>
        <br />
        <h1>Dynasty Dashboard</h1>

        <h2>
          <div className="image_container">
            <img
              style={{
                animation: `rotation ${Math.random() * 10 + 2
                  }s infinite ease-out`,
              }}
              className="thumbnail faded"
              alt="avatar"
              src={
                user.avatar === null
                  ? emoji
                  : `https://sleepercdn.com/avatars/${user.avatar}`
              }
            />
            <p className="image">{user.display_name}</p>
          </div>
        </h2>
        <div className="nav_container">
          <button
            onClick={() => setActiveTab("Leagues")}
            className={
              activeTab === "Leagues" ? "active nav clickable" : "nav clickable"
            }
          >
            Leagues
          </button>
          <button
            onClick={() => setActiveTab("Players")}
            className={
              activeTab === "Players" ? "active nav clickable" : "nav clickable"
            }
          >
            Players
          </button>
          <button
            onClick={() => setActiveTab("Leaguemates")}
            className={
              activeTab === "Leaguemates"
                ? "active nav clickable"
                : "nav clickable"
            }
          >
            Leaguemates
          </button>
          <button
            onClick={() => setActiveTab("Transactions")}
            className={
              activeTab === "Transactions"
                ? "active nav clickable"
                : "nav clickable"
            }
          >
            Transactions
          </button>
        </div>
        <div className="slidercontainer">
          <SliderToggle
            sendSelection={getSelection}
            className="slidertoggle"
            name="r_d"
            names={["Redraft", "All", "Dynasty"]}
            active="All"
          />
          <SliderToggle
            sendSelection={getSelection}
            className="slidertoggle"
            name="b_s"
            names={["BestBall", "All", "Standard"]}
            active="All"
          />
        </div>
      </div>
      <div hidden={activeTab === "All Players" ? false : true}>
        <PlayerInfo sendDV={(data) => setDv(data)} />
      </div>
      {activeTab === "Leagues" ? (
        leagues.length > 0 ? (
          <Leagues
            leagues={leagues.filter((x) => x.isLeagueTypeHidden === false)}
            matchPlayer_DV={matchPlayer_DV}
            matchPick={matchPick}
          />
        ) : (
          <h1>Loading...</h1>
        )
      ) : null}
      {activeTab === "Leaguemates" ? (
        leagues.length > 0 ? (
          <Leaguemates
            leagues={leagues.filter((x) => x.isLeagueTypeHidden === false)}
            user={user}
            matchPlayer_DV={matchPlayer_DV}
            matchPick={matchPick}
          />
        ) : (
          <h1>Loading...</h1>
        )
      ) : null}
      {activeTab === "Players" ? (
        leagues.length > 0 ? (
          <Lineups
            leagues={leagues.filter((x) => x.isLeagueTypeHidden === false)}
            user={user}
            matchPlayer_DV={matchPlayer_DV}
            matchPick={matchPick}
          />
        ) : (
          <h1>Loading...</h1>
        )
      ) : null}
      {activeTab === "Transactions" ?
        transactions.length > 0 ?
          <Transactions
            transactions={
              transactions.filter(x => leagues.find(y => y.league_id === x.league_id) !== undefined &&
                leagues.find(y => y.league_id === x.league_id).isLeagueTypeHidden === false)
            }
            user={user}
            matchPlayer_DV={matchPlayer_DV}
            matchPick={matchPick}
          />
          : <h1>Loading...</h1>
        : null}
    </>
  );
};

export default View;

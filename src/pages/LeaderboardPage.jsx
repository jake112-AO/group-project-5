import { useEffect, useState } from "react";
import { api } from "../lib/api";

function LeaderboardPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/leaderboard")
      .then((result) => setRows(result.leaderboard))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="panel">
      <h2>Leaderboard</h2>
      {error ? <p className="error">{error}</p> : null}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Score</th>
            <th>Level</th>
            <th>Accuracy</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.rank}</td>
              <td>{row.username}</td>
              <td>{row.reputationScore}</td>
              <td>{row.level}</td>
              <td>{row.accuracyRate}%</td>
              <td>{row.totalVotes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default LeaderboardPage;

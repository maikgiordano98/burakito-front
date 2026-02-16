import { useEffect, useState } from "react";

const API = "http://localhost:8080";

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(API + "/games")
      .then(r => r.json())
      .then(setGames);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Burako</h1>

      <ul>
        {games.map(g => (
          <li key={g.id}>
            {g.teamA} vs {g.teamB}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

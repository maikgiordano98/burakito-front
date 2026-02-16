import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import RoundScreen from './screens/RoundScreen';
import HistoryScreen from './screens/HistoryScreen';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [gameId, setGameId] = useState(null);
  const [teams, setTeams] = useState({ teamA: 'Nosotros', teamB: 'Ellos' });
  // En tu App.jsx, actualiza la lógica de navegación
  const resumeGame = (id, teamA, teamB) => {
    setGameId(id);
    setTeams({ teamA, teamB });
    setScreen('game'); // Volvemos al tablero con los datos de esa partida
  };



  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      {/* Header Sobrio */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md p-4 sticky top-0 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black tracking-widest text-amber-500 uppercase">BURAKO<span className="text-white font-light">STATS</span></h1>
          <button onClick={() => setScreen('history')} className="text-xs text-slate-400 hover:text-white transition-colors">HISTORIAL</button>
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4">
        {screen === 'home' && (
          <HomeScreen onGameCreated={(id, teamA, teamB) => {
            setGameId(id);
            setTeams({ teamA, teamB });
            setScreen('game');
          }} />
        )}
        {screen === 'game' && (
          <GameScreen gameId={gameId} teams={teams} onAddRound={() => setScreen('round')} onFinish={() => setScreen('home')} />
        )}
        {screen === 'round' && (
          <RoundScreen gameId={gameId} teams={teams} onSave={() => setScreen('game')} onCancel={() => setScreen('game')} />
        )}
        {screen === 'history' && (
          <HistoryScreen
            onBack={() => setScreen('home')}
            onResumeGame={resumeGame}
          />
        )}
      </main>
    </div>
  );
}
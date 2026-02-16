import { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import RoundScreen from './screens/RoundScreen';
import HistoryScreen from './screens/HistoryScreen';

// Componente Wrapper para GameScreen que recupera los equipos de la URL o estado
const GameWrapper = ({ teams, setTeams }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <GameScreen 
      gameId={id} 
      teams={teams} 
      onAddRound={() => navigate(`/game/${id}/round`)} 
      onFinish={() => navigate('/')} 
    />
  );
};

// Componente Wrapper para RoundScreen
const RoundWrapper = ({ teams }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <RoundScreen 
      gameId={id} 
      teams={teams} 
      onSave={() => navigate(`/game/${id}`)} 
      onCancel={() => navigate(`/game/${id}`)} 
    />
  );
};

export default function App() {
  const [teams, setTeams] = useState({ teamA: 'Nosotros', teamB: 'Ellos' });

  return (
    <Router>
      <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
        {/* Header Sobrio */}
        <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md p-4 sticky top-0 z-50">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <h1 className="text-xl font-black tracking-widest text-amber-500 uppercase cursor-pointer" onClick={() => window.location.hash = '/'}>
              BURAKO<span className="text-white font-light">STATS</span>
            </h1>
            <HeaderButtons />
          </div>
        </nav>

        <main className="max-w-md mx-auto p-4">
          <Routes>
            {/* Pantalla de Inicio */}
            <Route path="/" element={
              <HomeScreen onGameCreated={(id, teamA, teamB) => {
                setTeams({ teamA, teamB });
                window.location.hash = `/game/${id}`;
              }} />
            } />

            {/* Pantalla del Tablero del Juego */}
            <Route path="/game/:id" element={<GameWrapper teams={teams} setTeams={setTeams} />} />

            {/* Pantalla de Cargar Ronda */}
            <Route path="/game/:id/round" element={<RoundWrapper teams={teams} />} />

            {/* Historial */}
            <Route path="/history" element={
              <HistoryScreen
                onBack={() => window.location.hash = '/'}
                onResumeGame={(id, teamA, teamB) => {
                  setTeams({ teamA, teamB });
                  window.location.hash = `/game/${id}`;
                }}
              />
            } />

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Pequeño componente para el botón del historial usando navegación de router
const HeaderButtons = () => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate('/history')} 
      className="text-xs text-slate-400 hover:text-white transition-colors uppercase font-bold tracking-tighter"
    >
      HISTORIAL
    </button>
  );
};
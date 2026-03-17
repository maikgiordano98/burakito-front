import { isSupabaseConfigured } from '../lib/supabaseClient';
import * as storeLocal from '../store/gamesStore';
import * as storeSupabase from '../store/supabaseGamesStore';

const store = isSupabaseConfigured() ? storeSupabase : storeLocal;

/**
 * API: usa Supabase si hay VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY,
 * sino localStorage. Misma interfaz en ambos casos.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const path = endpoint.replace(/^\//, '').split('/');

  try {
    if (path[0] === 'games' && path.length === 1 && method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      return await store.createGame(body.teamA || '', body.teamB || '');
    }

    if (path[0] === 'games' && path.length === 1 && method === 'GET') {
      return await store.getAllGames();
    }

    if (path[0] === 'games' && path.length === 2 && path[1] && method === 'GET') {
      const game = await store.getGameById(path[1]);
      if (!game) throw new Error('Partida no encontrada');
      return game;
    }

    if (path[0] === 'games' && path.length === 3 && path[2] === 'rounds' && method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      await store.addRound(path[1], body);
      return {};
    }

    if (path[0] === 'games' && path.length === 3 && path[2] === 'finish' && method === 'POST') {
      await store.finishGame(path[1]);
      return {};
    }

    if (path[0] === 'games' && path.length === 2 && path[1] && method === 'DELETE') {
      await store.deleteGame(path[1]);
      return {};
    }

    throw new Error(`Ruta no soportada: ${method} ${endpoint}`);
  } catch (err) {
    if (err.message?.startsWith('Ruta no soportada') || err.message === 'Partida no encontrada') {
      throw err;
    }
    console.error('Error en api:', err);
    throw err;
  }
};

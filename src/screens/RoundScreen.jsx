import { useState } from 'react';
import { apiFetch } from '../api/client';

// Movido fuera para evitar que el input pierda el foco al escribir
const TeamSection = ({ teamKey, teamName, isA, form, handleChange, setForm }) => {
    const letter = isA ? "A" : "B";
    return (
        <div className="space-y-4 bg-[#1e293b]/50 p-5 rounded-2xl border border-slate-800 shadow-inner">
            <h3 className="text-amber-500 font-black uppercase text-xs tracking-[0.2em] mb-4">{teamName}</h3>

            <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Puntos en mano (fichas)</label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={form[`team${letter}Points`]}
                    placeholder="Ej: 120"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 mt-1 outline-none focus:border-amber-500 text-white transition-all"
                    onChange={e => handleChange(`team${letter}Points`, e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">C. Puras</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={form[`team${letter}CanastasPuras`]}
                        placeholder="0"
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 mt-1 outline-none focus:border-amber-500 text-white"
                        onChange={e => handleChange(`team${letter}CanastasPuras`, e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">C. Impuras</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={form[`team${letter}CanastasImpuras`]}
                        placeholder="0"
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-3 mt-1 outline-none focus:border-amber-500 text-white"
                        onChange={e => handleChange(`team${letter}CanastasImpuras`, e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-3 p-3 bg-[#0f172a] rounded-xl border border-slate-800 cursor-pointer hover:border-slate-600 transition-all">
                    <input
                        type="checkbox"
                        checked={form[`team${letter}LevantoMuerto`]}
                        className="w-5 h-5 accent-amber-500"
                        onChange={e => setForm(prev => ({ ...prev, [`team${letter}LevantoMuerto`]: e.target.checked }))}
                    />
                    <span className="text-xs text-slate-300 font-medium">Levantó Muerto</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[#0f172a] rounded-xl border border-slate-800 cursor-pointer hover:border-amber-500/50 transition-all">
                    <input
                        type="radio"
                        name="whoClosed"
                        checked={form.teamWhoClosed === letter}
                        className="w-5 h-5 accent-amber-500"
                        onChange={() => setForm(prev => ({ ...prev, teamWhoClosed: letter }))}
                    />
                    <span className="text-xs text-slate-300 font-medium">Hizo el Corte (+100)</span>
                </label>
            </div>
        </div>
    );
};

export default function RoundScreen({ gameId, teams, onSave, onCancel }) {
    const [form, setForm] = useState({
        teamAPoints: "",
        teamBPoints: "",
        teamACanastasPuras: "",
        teamBCanastasPuras: "",
        teamACanastasImpuras: "",
        teamBCanastasImpuras: "",
        teamALevantoMuerto: false,
        teamBLevantoMuerto: false,
        teamWhoClosed: null // "A" o "B"
    });

    const handleChange = (field, value) => {
        // Validar que solo entren números
        if (value !== "" && !/^\d+$/.test(value)) return;
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const saveRound = async () => {
        try {

            const payload = {
                teamAPoints: parseInt(form.teamAPoints) || 0,
                teamBPoints: parseInt(form.teamBPoints) || 0,
                teamACanastasPuras: parseInt(form.teamACanastasPuras) || 0,
                teamBCanastasPuras: parseInt(form.teamBCanastasPuras) || 0,
                teamACanastasImpuras: parseInt(form.teamACanastasImpuras) || 0,
                teamBCanastasImpuras: parseInt(form.teamBCanastasImpuras) || 0,
                teamALevantoMuerto: form.teamALevantoMuerto,
                teamBLevantoMuerto: form.teamBLevantoMuerto,
                teamACorto: form.teamWhoClosed === "A",
                teamBCorto: form.teamWhoClosed === "B",
            };


            await apiFetch(`/games/${gameId}/rounds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            onSave();

        } catch (error) {
            console.error("Error de red:", error);
            alert("Error al guardar la ronda en el servidor");
        }
    };

    return (
        <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center px-2">
                <h2 className="text-2xl font-black text-white italic tracking-tighter">CARGAR RONDA</h2>
                <button onClick={onCancel} className="text-slate-500 text-xs hover:text-white transition-colors">CANCELAR</button>
            </div>

            <div className="flex flex-col gap-6">
                <TeamSection
                    teamKey="teamA"
                    teamName={teams.teamA}
                    isA={true}
                    form={form}
                    handleChange={handleChange}
                    setForm={setForm}
                />
                <TeamSection
                    teamKey="teamB"
                    teamName={teams.teamB}
                    isA={false}
                    form={form}
                    handleChange={handleChange}
                    setForm={setForm}
                />
            </div>

            <div className="sticky bottom-4 pt-4 bg-[#020617]/80 backdrop-blur-sm">
                <button
                    onClick={saveRound}
                    className="w-full bg-amber-500 text-[#020617] font-black py-5 rounded-2xl shadow-xl hover:bg-amber-400 transition-all active:scale-95"
                >
                    CONFIRMAR PUNTOS
                </button>
            </div>
        </div>
    );
}
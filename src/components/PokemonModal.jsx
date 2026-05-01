import { useEffect } from "react";


const TYPE_COLORS = {
  grass: { bg: "#dcfce7", text: "#166534" },
  fire: { bg: "#fee2e2", text: "#991b1b" },
  water: { bg: "#dbeafe", text: "#1e40af" },
  electric: { bg: "#fef9c3", text: "#854d0e" },
  poison: { bg: "#f3e8ff", text: "#6b21a8" },
  bug: { bg: "#ecfccb", text: "#3f6212" },
  normal: { bg: "#f1f5f9", text: "#475569" },
  flying: { bg: "#e0e7ff", text: "#3730a3" },
  ground: { bg: "#fef3c7", text: "#92400e" },
  fairy: { bg: "#fce7f3", text: "#9d174d" },
  fighting: { bg: "#fee2e2", text: "#7f1d1d" },
  psychic: { bg: "#fce7f3", text: "#831843" },
  rock: { bg: "#f5f5f4", text: "#44403c" },
  ghost: { bg: "#ede9fe", text: "#4c1d95" },
  ice: { bg: "#cffafe", text: "#164e63" },
  dragon: { bg: "#ddd6fe", text: "#3730a3" },
  dark: { bg: "#e7e5e4", text: "#1c1917" },
  steel: { bg: "#f1f5f9", text: "#334155" },
};

const stats = [
  { key: "hp",           label: "HP",       color: "#22c55e", max: 150 },
  { key: "attack",       label: "Atk",      color: "#ef4444", max: 100 },
  { key: "defense",      label: "Def",      color: "#3b82f6", max: 100 },
  { key: "specialAttack",label: "Sp.Atk",  color: "#a855f7", max: 100 },
  { key: "speed",        label: "Speed",    color: "#f59e0b", max: 100 },
];

function StatBar({ label, value, color, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "#64748b" }}>{label}</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f172a" }}>{value}</span>
      </div>
      <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: "999px", transition: "width 0.5s ease" }} />
      </div>
    </div>
  );
}

function PokemonModal({ pokemon, isFavorite, onClose, onToggleFavorite }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!pokemon) return null;

  return (
    <div className="pokemon-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="pokemon-modal-box"
        role="dialog"
        aria-modal="true"
        aria-label={`${pokemon.name} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 style={{ margin: "2px 0 6px", fontSize: "1.6rem", fontWeight: 700, textTransform: "capitalize", color: "#0f172a" }}>
              {pokemon.name} <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                #{String(pokemon.id).padStart(3, "0")}
              </span>
            </h2>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {pokemon.types.map((type) => {
                const c = TYPE_COLORS[type] || { bg: "#f1f5f9", text: "#475569" };
                return (
                  <span key={type} style={{ background: c.bg, color: c.text, padding: "3px 10px", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 600, textTransform: "capitalize" }}>
                    {type}
                  </span>
                );
              })}
            </div>
          </div>

          <button type="button" onClick={onClose} className="close-btn" aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-left">
            <img className="pokemon-modal-image" src={pokemon.image} alt={pokemon.name} />
          </div>

          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
              Base Stats
            </p>
            {stats.map((s) => (
              <StatBar key={s.key} label={s.label} value={pokemon[s.key] ?? 0} color={s.color} max={s.max} />
            ))}

            <div style={{ marginTop: "10px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "0.78rem", color: "#64748b" }}>
              <span>Height: <strong style={{ color: "#0f172a" }}>{(pokemon.height / 10).toFixed(1)} m</strong></span>
              <span>Weight: <strong style={{ color: "#0f172a" }}>{(pokemon.weight / 10).toFixed(1)} kg</strong></span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(pokemon.id)}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "background 0.15s",
            background: isFavorite ? "#ef4444" : "#f1f5f9",
            color: isFavorite ? "#fff" : "#0f172a",
          }}
        >
          {isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
        </button>
      </div>
    </div>
  );
}

export default PokemonModal;
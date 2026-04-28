function PokemonCard({ pokemon, onClose }) {

  if (!pokemon) return null;

  return (
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      {/* Header */}
      <div className="modal-header">
        <div>
          <p className="small">POKÉMON DETAIL</p>
          <h2>{pokemon.name}</h2>
          <p>
            #{String(pokemon.id).padStart(3, "0")} •{" "}
            {pokemon.types.map(t => t.type.name).join(" / ")}
          </p>
        </div>

        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {/* Body */}
      <div className="modal-body">
        <div className="left">
          <img
            src={
              pokemon.sprites.other?.["official-artwork"]?.front_default
            }
            alt={pokemon.name}
          />
        </div>

        <div className="right">
          <h4>Stats</h4>

          <div className="stat">
            <span>HP</span>
            <span>{pokemon.stats[0].base_stat}</span>
          </div>

          <div className="stat">
            <span>Attack</span>
            <span>{pokemon.stats[1].base_stat}</span>
          </div>

          <div className="stat">
            <span>Defense</span>
            <span>{pokemon.stats[2].base_stat}</span>
          </div>

          <div className="stat">
            <span>Speed</span>
            <span>{pokemon.stats[5].base_stat}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonCard;
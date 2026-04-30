import { useEffect, useState } from "react";

function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onSelectPokemon,
  typesColor = {},
}) {
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isFavoriting) return;

    setStatusText(`Capturing ${pokemon.name}...`);
    setIsComplete(false);

    const midTimer = setTimeout(() => {
      setStatusText(`Gotcha! ${pokemon.name} was caught!`);
      setIsComplete(true);
    }, 700);

    const endTimer = setTimeout(() => {
      setIsFavoriting(false);
    }, 1300);

    return () => {
      clearTimeout(midTimer);
      clearTimeout(endTimer);
    };
  }, [isFavoriting, pokemon.name]);

  return (
    <article
      className={`pokemon-card${isFavorite ? " is-favorited" : ""}${
        isFavoriting ? " is-favoriting" : ""
      }`}
      role="button"
      tabIndex={0}
      onClick={() => onSelectPokemon(pokemon)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectPokemon(pokemon);
        }
      }}
    >
      <button
        type="button"
        className={`pokemon-card__favorite${isFavorite ? " is-active" : ""} cursor-pointer`}
        onClick={(event) => {
          event.stopPropagation();

          if (!isFavorite) {
            setIsFavoriting(true);
          }
          onToggleFavorite(pokemon.id);
        }}
        aria-label={`${isFavorite ? "Remove" : "Add"} ${pokemon.name} to favorites`}
      >
        {isFavorite ? "♥" : "♡"}
      </button>

      <div className="pokemon-card__image-wrap">
        <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
      </div>

      <div className="pokemon-card__body">
        <h3>{pokemon.name}</h3>

        <div className="pokemon-card__types">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className="type-pill capitalize"
              style={{
                backgroundColor: typesColor[type] || "#e2e8f0",
              }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
      <div className="capture-animation-overlay">
        <div className="pokeball-container">
          <div className="pokeball-top"></div>
          <div className="pokeball-bottom"></div>
          <div className="pokeball-button"></div>
        </div>
        <p
          className={`capture-status-text${
            isComplete ? " is-complete" : ""
          }`}
        >
          {statusText}
        </p>
      </div>
    </article>
  );
}

export default PokemonCard;
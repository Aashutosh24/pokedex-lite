import { useEffect } from "react";

function PokemonModal({ pokemon, isFavorite, onClose, onToggleFavorite }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!pokemon) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-opacity-2 flex items-center justify-center z-50"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={`${pokemon.name} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              Pokemon detail
            </p>
            <h2 className="text-3xl font-bold capitalize mb-1">
              {pokemon.name}
            </h2>
            <p className="text-gray-600">
              #{String(pokemon.id).padStart(3, "0")} • {pokemon.types.join(" / ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600 font-light cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-50 rounded-lg p-6 mb-6 flex items-center justify-center min-h-64">
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className="w-full h-auto max-w-xs"
              />
            </div>

          </div>

          <div>
            <section className="mb-8">
               < div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-semibold text-gray-700">HP</span>
                <span className="text-lg font-bold text-teal-600">
                  {pokemon.hp}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-semibold text-gray-700">Height</span>
                <span className="text-lg font-bold text-rose-700">
                  {pokemon.height}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-semibold text-gray-700">Attack</span>
                <span className="text-lg font-bold text-blue-600">
                  {pokemon.attack}
                </span>
              </div>
              <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-semibold text-gray-700">Defense</span>
                <span className="text-lg font-bold text-green-600">
                  {pokemon.defense}
                </span>
              </div>
            </div>
              <h3 className="text-lg font-semibold mt-7 mb-4 text-gray-900">
                Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-blue-100 text-blue-800  text-sm font-medium capitalize"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </section>

            <button
              type="button"
              onClick={() => onToggleFavorite(pokemon.id)}
              className={`w-full py-3 rounded-lg font-semibold transition-all cursor-pointer ${
                isFavorite
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              {isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonModal;

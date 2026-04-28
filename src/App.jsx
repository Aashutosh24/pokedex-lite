import { useEffect, useState } from "react";
import "./App.css";

import PokemonCard from "./components/pokemonCard.jsx";

function App() {
  const POKEMON_API = "https://pokeapi.co/api/v2";

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        const response = await fetch(`${POKEMON_API}/pokemon?limit=50`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const pokemonList = result.results;

        const detailedData = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
          }),
        );

        setData(detailedData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchData();
  }, []);

  
  return (
    <>
      <h1 className="text-3xl m-15 font-bold underline">
        {" "}
        Welcome to Pokemon World!{" "}
      </h1>
      <h3 className="text-lg font-semibold">Discover your favorite Pokemon!</h3>
      
      <div className="grid grid-cols-1 mt-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {selectedPokemon && (
  <PokemonCard
    pokemon={selectedPokemon}
    onClose={() => setSelectedPokemon(null)}
  />
        )}
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-wheat rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105" onClick={() => setSelectedPokemon(item)}
          >
            <div className="img_poke">
              <img
                src={item.sprites.other?.["official-artwork"]?.front_default}
                alt={item.name}
              />
            </div>
            <div className="p-4">
              <strong className="text-lg capitalize block">{item.name}</strong>
              {item.types &&
                item.types.map((t, index) => (
                  <p key={index} className="type">
                    {t.type.name}
                  </p>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;

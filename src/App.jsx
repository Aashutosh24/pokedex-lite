import { useEffect, useState } from "react";
import "./App.css";
import { ThemeProvider } from "./Context/theme.js";

import PokemonCard from "./components/pokemonCard.jsx";
import ThemeBtn from "./components/ThemeBtn.jsx";
function App() {
  const POKEMON_API = "https://pokeapi.co/api/v2";

  const [allPokemon, setAllPokemon] = useState([]);
  const [data, setData] = useState([]);
  const [types, setTypes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [themeMode, setThemeMode] = useState("light");
  const [page, setPage] = useState(0);
  const [searchPoke, setSearchPoke] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const typeColors = {
    grass: "#A8E6A3",
    fire: "#F5B97A",
    water: "#A7C7E7",
    electric: "#F9E79F",
    poison: "#D2B4DE",
    bug: "#D4E157",
    normal: "#E0E0E0",
    flying: "#C5CAE9",
    ground: "#E6CBA8",
    fairy: "#F8C8DC",
  };
  const PAGE_SIZE = 20;

  const darkTheme = () => {
    setThemeMode("dark");
  };

  const lightTheme = () => {
    setThemeMode("light");
  };

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${POKEMON_API}/pokemon?limit=2000`);

        if (!res.ok) {
          throw new Error(
            `Unable to load Pokemon list. HTTP error! Status: ${res.status}`,
          );
        }

        const result = await res.json();
        setAllPokemon(result.results ?? []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        const searchablePokemon = allPokemon.filter((pokemon) =>
          pokemon.name
            .toLowerCase()
            .includes(searchPoke.toLowerCase()),
        );

        const start = page * PAGE_SIZE;
        const pagePokemon = searchablePokemon.slice(start, start + PAGE_SIZE);

        const detailedData = await Promise.all(
          pagePokemon.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            if (!res.ok) {
              throw new Error(
                `Unable to load Pokemon details. HTTP error! Status: ${res.status}`,
              );
            }
            return res.json();
          }),
        );

        const typeFilteredData =
          selectedType === "all"
            ? detailedData
            : detailedData.filter((pokemon) =>
                pokemon.types.some((t) => t.type.name === selectedType),
              );

        setData(typeFilteredData);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchData();
  }, [allPokemon, page, searchPoke, selectedType]);
  useEffect(() => {
    const fetchTypes = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      const cleanTypes = data.results.filter(
        (t) => t.name !== "shadow" && t.name !== "unknown",
      );

      setTypes(cleanTypes);
    };

    fetchTypes();
  }, []);

  const searchablePokemon = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchPoke.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(searchablePokemon.length / PAGE_SIZE));
  return (
    <>
      <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
        <div className="dark:bg-sky-700">
          <h1 className="text-3xl m-5 font-bold underline dark:text-white p-6 rounded-lg">
            {" "}
            Welcome to Pokemon World!{" "}
          </h1>
          <div className="w-fit max-w-sm flex p-2 rounded-4xl dark:text-white dark:bg-yellow-100 absolute right-0 top-4">
            <ThemeBtn />
          </div>
          <h3 className="text-lg font-semibold">
            Discover your favorite Pokemon!
          </h3>
          <div className="max-w-3xl mx-auto mt-6 p-4 bg-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name"
              value={searchPoke}
              onChange={(e) => {
                setSearchPoke(e.target.value);
                setPage(0);
              }}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               bg-white"
            />
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(0);
              }}
              className="px-4 py-3 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               bg-white cursor-pointer"
            >
              <option value="all">All</option>
              {types.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name.charAt(0).toUpperCase() + t.name.slice(1) }
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 mt-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  dark:text-cyan-500 dark:bg-gray-700 p-12 rounded-lg ml-18 mr-18">
            {selectedPokemon && (
              <PokemonCard
                pokemon={selectedPokemon}
                onClose={() => setSelectedPokemon(null)}
              />
            )}
            {data.length === 0 ? (
              <p className="text-center mt-10 text-gray-500">
                No Pokémon found
              </p>
            ) : (
              data.map((item) => (
                <div
                  key={item.id}
                  className="bg-emerald-100 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105 dark:bg-green-200"
                  onClick={() => setSelectedPokemon(item)}
                >
                  <div className="img_poke">
                    <img
                      src={
                        item.sprites.other?.["official-artwork"]?.front_default
                      }
                      alt={item.name}
                    />
                  </div>
                  <div className="p-4">
                    <strong className="text-lg capitalize block">
                      {item.name}
                    </strong>
                    {item.types &&
                      item.types.map((t, index) => (
                        <p
                          key={index}
                          className="type"
                          style={{ backgroundColor: typeColors[t.type.name] ,
                            border: "1px solid rgba(0,0,0,0.1)"
                          }}
                        >
                          {t.type.name}
                        </p>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => (p > 0 ? p - 1 : p))}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <span className="px-4 py-2">Page {page + 1}</span>

            <button
              onClick={() => setPage((p) => (p < totalPages - 1 ? p + 1 : p))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;

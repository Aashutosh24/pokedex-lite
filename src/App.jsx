import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { ThemeProvider } from "./Context/theme.js";

import PokemonCard from "./components/pokemonCard.jsx";
import ThemeBtn from "./components/ThemeBtn.jsx";
import FavoritesToggle from "./components/favoritesToggle.jsx";
import PokemonModal from "./components/PokemonModal.jsx";

const POKEMON_API = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 20;
const FAVORITES_KEY = "poke-favorites";

function parsePokemonId(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

function normalizePokemon(details) {
  const stats = details.stats.reduce((acc, stat) => {
    acc[stat.stat.name] = stat.base_stat;
    return acc;
  }, {});

  return {
    id: details.id,
    name: details.name,
    image:
      details.sprites.other?.["official-artwork"]?.front_default ||
      details.sprites.front_default ||
      "",
    types: details.types.map((t) => t.type.name),
    height: details.height,
    hp: stats.hp ?? 0,
    attack: stats.attack ?? 0,
    defense: stats.defense ?? 0,
    speed: stats.speed ?? 0,
  };
}

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [pokemonById, setPokemonById] = useState({});
  const [types, setTypes] = useState([]);
  const [typeMembershipMap, setTypeMembershipMap] = useState({});
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [themeMode, setThemeMode] = useState("light");
  const [page, setPage] = useState(1);
  const [searchPoke, setSearchPoke] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const darkTheme = () => setThemeMode("dark");
  const lightTheme = () => setThemeMode("light");

  const typesColor = {
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
  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

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
        const list = (result.results ?? [])
          .map((entry) => ({
            name: entry.name,
            url: entry.url,
            id: parsePokemonId(entry.url),
          }))
          .filter((p) => p.id);
        setAllPokemon(list);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchAll();
  }, []);

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

  useEffect(() => {
    if (selectedType === "all") return;
    if (typeMembershipMap[selectedType]) return;

    const fetchTypeList = async () => {
      const res = await fetch(`${POKEMON_API}/type/${selectedType}`);
      const data = await res.json();
      setTypeMembershipMap((prev) => ({
        ...prev,
        [selectedType]: new Set(data.pokemon.map((p) => p.pokemon.name)),
      }));
    };

    fetchTypeList();
  }, [selectedType, typeMembershipMap]);

  useEffect(() => {
    setPage(1);
  }, [searchPoke, selectedType, showFavorites]);

  const filteredPokemon = useMemo(() => {
    const query = searchPoke.toLowerCase();
    const typeSet =
      selectedType === "all" ? null : typeMembershipMap[selectedType];
    const favSet = new Set(favoriteIds);

    return allPokemon.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(query);
      const matchesType = !typeSet || typeSet.has(pokemon.name);
      const matchesFavorite = showFavorites ? favSet.has(pokemon.id) : true;
      return matchesSearch && matchesType && matchesFavorite;
    });
  }, [
    allPokemon,
    searchPoke,
    selectedType,
    showFavorites,
    favoriteIds,
    typeMembershipMap,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredPokemon.length / PAGE_SIZE));

  const pagePokemon = filteredPokemon.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    const fetchDetails = async () => {
      const missing = pagePokemon.filter((p) => !pokemonById[p.id]);
      if (missing.length === 0) return;

      const details = await Promise.all(
        missing.map(async (pokemon) => {
          const res = await fetch(`${POKEMON_API}/pokemon/${pokemon.id}`);
          const data = await res.json();
          return normalizePokemon(data);
        }),
      );

      setPokemonById((prev) => {
        const next = { ...prev };
        details.forEach((p) => {
          next[p.id] = p;
        });
        return next;
      });
    };

    fetchDetails();
  }, [pagePokemon, pokemonById]);

  const handleToggleFavorite = (pokemonId) => {
    setFavoriteIds((prev) => {
      if (prev.includes(pokemonId)) {
        return prev.filter((id) => id !== pokemonId);
      }
      return [...prev, pokemonId];
    });
  };

  return (
    <>
      <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
        <div className="dark:bg-zinc-900">
          <h1 className="text-3xl m-5 m:mt-8 md:mt-16 lg:mt-8 font-bold text-emerald-700 dark:text-lime-300 p-6 rounded-lg ">
            {" "}
            Welcome to Pokemon World!{" "}
          </h1>
          <div className="w-fit max-w-sm flex p-2 rounded-4xl dark:text-white dark:bg-yellow-100 absolute right-3 top-8">
            <ThemeBtn />
          </div>
          <h3 className="text-2xl font-semibold dark:text-sky-200">
            Discover your favorite Pokemon!
          </h3>

          <div className="max-w-3xl mx-auto mt-6 p-4 bg-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search by name"
              value={searchPoke}
              onChange={(e) => setSearchPoke(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               bg-white dark:text-black"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               bg-white cursor-pointer dark:text-black"
            >
              <option value="all">All</option>
              {types.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name.charAt(0).toUpperCase() + t.name.slice(1)}
                </option>
              ))}
            </select>
            <FavoritesToggle
            showFavorites={showFavorites}
            onToggle={() => setShowFavorites((s) => !s)}
          />
          </div>

          

          <div className="grid grid-cols-1 mt-15 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 dark:text-cyan-500 dark:bg-gray-700 p-12 rounded-lg ml-18 mr-18">
            {pagePokemon.length === 0 ? (
              <p className="text-center mt-10 text-gray-500">
                No Pokémon found
              </p>
            ) : (
              pagePokemon.map((item) => {
                const full = pokemonById[item.id];
                if (!full) return null;

                return (
                  <PokemonCard
                    pokemon={full}
                    isFavorite={favoriteIds.includes(full.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectPokemon={() => setSelectedPokemon(full)}
                    typesColor={typesColor}
                  />
                );
              })
            )}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => (p > 1 ? p - 1 : p))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <span className="px-4 py-2">Page {page}</span>

            <button
              onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </ThemeProvider>

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          isFavorite={favoriteIds.includes(selectedPokemon.id)}
          onClose={() => setSelectedPokemon(null)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </>
  );
}

export default App;

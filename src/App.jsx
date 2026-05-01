import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { ThemeProvider } from "./Context/theme.js";

import PokemonCard from "./components/pokemonCard.jsx";
import ThemeBtn from "./components/ThemeBtn.jsx";
import FavoritesToggle from "./components/favoritesToggle.jsx";
import PokemonModal from "./components/PokemonModal.jsx";
import GoogleLogin from "./components/GoogleLogin.jsx";

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
    specialAttack: stats["special-attack"] ?? 0,
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
  const [toast, setToast] = useState("");
  const [phoneAuth, setPhoneAuth] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );

  const darkTheme = () => setThemeMode("dark");
  const lightTheme = () => setThemeMode("light");

  const typesColor = {
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
    if (!user) {
      alert("Please login to add favorites");
      return;
    }
    setFavoriteIds((prev) => {
      if (prev.includes(pokemonId)) {
        return prev.filter((id) => id !== pokemonId);
      }
      return [...prev, pokemonId];
    });
  };
  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2000);
  };

  return (
    <>
      <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
        <div className="dark:bg-zinc-900 ">
          {toast && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 
                  bg-gray-900 text-white px-6 py-3 
                  rounded-xl shadow-lg z-10 font-bold text-lg
                  animate-fadeInOut"
            >
              {toast}
            </div>
          )}
          <div className="max-w-6xl mx-auto flex items-center gap-3 px-6 pt-8 pb-2">
            <img
              src="/icon.png"
              alt="Pokeball"
              className="w-10 h-10 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 leading-tight">
                Pokedex
              </h1>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {allPokemon.length > 0
                  ? `${allPokemon.length} Pokemon indexed`
                  : ""}
              </p>
            </div>
          </div>
          <div className="absolute right-4 top-6 flex items-center gap-3">
            {!user && (
              <div className="hidden cursor-pointer">
                <GoogleLogin setUser={setUser} />
              </div>
            )}
            <div className="hidden sm:flex items-center gap-3">
              {!user ? (
                <button
                  onClick={() => window.google.accounts.id.prompt()}

                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg cursor-pointer"
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-white dark:bg-black px-3 py-2 rounded-xl shadow-sm">
                  <img src={user.picture} className="w-8 h-8 rounded-full" />
                  <p className="text-sm">{user.name}</p>
                  <button
                    onClick={() => {
                      setUser(null);
                      localStorage.removeItem("user");
                    }}
                    className="text-sm px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer dark:black"
                  >
                    Logout
                  </button>
                </div>
              )}

              <ThemeBtn />
            </div>
            <button
              onClick={() => setPhoneAuth((s) => !s)}
              className="sm:hidden w-10 h-10 rounded-full bg-emerald-500 text-white"
            >
              ☰
            </button>
            {phoneAuth && (
              <div className="sm:hidden absolute right-4 top-16 w-60 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-lg">
                {!user ? (
                  <button
                    onClick={() => {
                      window.google.accounts.id.prompt();
                      setPhoneAuth(false);
                    }}
                    className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg cursor-pointer"
                  >
                    Login with Google
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <img src={user.picture} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="text-sm">{user.name}</p>
                      <button
                        onClick={() => {
                          setUser(null);
                          localStorage.removeItem("user");
                          setPhoneAuth(false);
                        }}
                        className="text-xs text-red-500 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <ThemeBtn />
                </div>
              </div>
            )}
          </div>

          <h3 className="text-2xl font-semibold dark:text-sky-200 mt-5">
            Discover your favorite Pokemon!
          </h3>

          <div className="max-w-3xl mx-auto mt-6 p-4 bg-gray-100 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center dark:bg-gray-700 ">
            <input
              type="text"
              placeholder="Search by name"
              value={searchPoke}
              onChange={(e) => setSearchPoke(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               bg-white dark:text-sky-200 dark:bg-zinc-600"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 
               focus:outline-none focus:ring-2 focus:ring-blue-400 
               bg-white cursor-pointer dark:text-sky-300 dark:bg-zinc-600"
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

          <div className="pokemon-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 dark:text-cyan-500 p-12 rounded-lg ml-18 mr-18">
            {pagePokemon.length === 0 ? (
              <p className="text-center mt-10 text-gray-500">
                No Pokemon found
              </p>
            ) : (
              pagePokemon.map((item) => {
                const full = pokemonById[item.id];
                if (!full) return null;

                return (
                  <PokemonCard
                    key={full.id}
                    pokemon={full}
                    isFavorite={favoriteIds.includes(full.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectPokemon={() => setSelectedPokemon(full)}
                    typesColor={typesColor}
                    user={user}
                    showToast={showToast}
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

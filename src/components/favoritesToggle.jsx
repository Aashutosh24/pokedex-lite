function FavoritesToggle({ showFavorites, onToggle }) {
  const buttonBase = "rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 cursor-pointer";
  const buttonState = showFavorites
    ? "border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200 focus:ring-amber-200 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-black-200 dark:hover:bg-amber-400/15 dark:focus:ring-amber-400/20"
    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:ring-slate-700";

  return (
    <div className="flex justify-start">
      <button
        onClick={onToggle}
        className={`${buttonBase} ${buttonState}`}
      >
        {showFavorites ? "Showing favorites" : "Show favorites"}
      </button>
    </div>
  );
}

export default FavoritesToggle;
function FavoritesToggle({ showFavorites, onToggle }) {
  const buttonBase =
    "rounded-full border px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 cursor-pointer";
  const buttonState = showFavorites
    ? "border-amber-200 bg-amber-50 text-amber-950 shadow-[0_0_0_1px_rgba(251,191,36,0.35),0_0_18px_rgba(250,204,21,0.35)] hover:bg-amber-100 focus:ring-amber-200 dark:border-amber-300/30 dark:bg-amber-200 dark:text-amber-600 dark:hover:bg-amber-100 dark:focus:ring-amber-400/20"
    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-800  dark:focus:ring-slate-700";

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
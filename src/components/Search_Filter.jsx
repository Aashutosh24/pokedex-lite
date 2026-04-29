function Filters({
  searchPoke,
  selectedType,
  types,
  onSearchChange,
  onTypeChange,
  onClearFilters,
}) {
  return (
    <section className="filters">
      <div className="filter-field">
        <label>Search by name</label>
        <input
          type="search"
          value={searchPoke}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Start typing a name"
        />
      </div>

      <div className="filter-field">
        <label>Filter by type</label>
        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="all">All types</option>

          {types.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={onClearFilters}>
        Reset
      </button>
    </section>
  );
}

export default Filters;
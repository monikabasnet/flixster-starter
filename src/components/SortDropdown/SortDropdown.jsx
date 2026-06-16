import './SortDropdown.css';

const SortDropdown = ({ currentSort, onSortChange }) => {
  return (
    <div className="sort-dropdown-container">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <select
        id="sort-select"
        className="sort-dropdown"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort movies"
      >
        <option value="rating-desc">Rating (High to Low)</option>
        <option value="rating-asc">Rating (Low to High)</option>
        <option value="title-asc">Title (A-Z)</option>
        <option value="title-desc">Title (Z-A)</option>
        <option value="release-desc">Release Date (Newest)</option>
        <option value="release-asc">Release Date (Oldest)</option>
      </select>
    </div>
  );
};

export default SortDropdown;

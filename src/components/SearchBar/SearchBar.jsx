import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, currentQuery }) => {
  const [inputValue, setInputValue] = useState(currentQuery || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for movies..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label="Search for movies"
        />
        <button
          type="submit"
          className="search-button"
          aria-label="Submit search"
        >
          🔍 Search
        </button>
        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕ Clear
        </button>
      </div>
    </form>
  );
};

export default SearchBar;

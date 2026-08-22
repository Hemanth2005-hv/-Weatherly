import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiX } from 'react-icons/fi';

const SearchBar = ({
  onSearch,
  onSelectCity,
  onUseMyLocation,
  searchResults,
  searching,
  onSelectFavorite,
  favorites,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  const handleSelect = (city) => {
    setQuery('');
    setIsFocused(false);
    onSelectCity(city);
    inputRef.current?.blur();
  };

  const handleFavoriteClick = (fav) => {
    setQuery('');
    setIsFocused(false);
    onSelectFavorite(fav);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const showDropdown = isFocused && (searchResults.length > 0 || (query.length >= 2 && !searching));

  return (
    <div className="search-container">
      <motion.div
        className={`search-bar ${isFocused ? 'focused' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <FiSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search any city in the world..."
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        {query && (
          <button className="clear-btn" onClick={handleClear}>
            <FiX />
          </button>
        )}
        <button
          className="location-btn"
          onClick={onUseMyLocation}
          title="Use my location"
        >
          <FiMapPin />
          <span>My Location</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className="search-dropdown"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {searching ? (
              <div className="search-status">Searching cities...</div>
            ) : searchResults.length > 0 ? (
              searchResults.map((city, i) => (
                <motion.button
                  key={city.id}
                  className="search-result"
                  onClick={() => handleSelect(city)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <FiMapPin className="result-icon" />
                  <div className="result-info">
                    <span className="result-name">{city.name}</span>
                    <span className="result-location">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="search-status">
                No cities found. Try a different search.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {favorites.length > 0 && !isFocused && (
        <motion.div
          className="favorites-strip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {favorites.slice(0, 5).map((fav) => (
            <button
              key={fav.id}
              className="favorite-chip"
              onClick={() => handleFavoriteClick(fav)}
            >
              ⭐ {fav.name}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;
